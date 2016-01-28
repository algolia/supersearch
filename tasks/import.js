'use strict';

let https         = require('https');
let algoliasearch = require('algoliasearch');
let client        = algoliasearch('VC519DRAY3', '');
let index         = client.initIndex('sb_ads');

function matcher(regex) {
  return function(str) {
    let match = str.match(regex);

    if(!match) { return ''; }

    return match[1];
  }
}

var year = matcher(/\((\d{4})\)/);
var sbYear = matcher(/(?:(?:Super Bowl)|SuperBowl) ([XLIV]+)/i);
var brand = matcher(/(.+) (?:(?:Super Bowl)|SuperBowl)/i);

function getVideos(playlists){
  playlists.forEach(function(playlist){
    cycleVideos(playlist);
  });
}

function cycleVideos(playlist, pageToken) {
  let url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=' + playlist.id + '&key=AIzaSyAP_ZKNpQqE0doSn3jj0aZ7lvxJTzlFVFU';

  if(pageToken){
    url += `&pageToken=${pageToken}`;
  }

  https.get(url, function(res){
    let data = '';

    res.on('data', function(body){
      data += body;
    });

    res.on('end', function(){
      let parsed = JSON.parse(data);
      let pageToken = parsed.nextPageToken;

      var items = parsed.items.filter(function(item){
        return item.snippet.title.match(/ ad /)
      }).map(function(item){
        return {
          objectID: item.snippet.resourceId.videoId,
          publishedAt: Date.parse(item.snippet.publishedAt)/1000,
          description: item.snippet.description,
          title: item.snippet.title,
          thumbnails: item.snippet.thumbnails,
          year: parseInt(year(item.snippet.title)),
          sbYear: sbYear(item.snippet.title),
          brand: brand(item.snippet.title)
        };
      });

      index.addObjects(items, function(err, content){
        if(err){
          return console.warn(err);
        }

        if(pageToken) {
          cycleVideos(playlist, pageToken);
        } else {
          return console.log('Got all videos for playlist ' + playlist.id);
        }
      })

    });
  });
}

function getPlaylists(playlists, pageToken){
  let url = 'https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=UCaDQC4iLWkq5Pkd1FRBnOuQ&maxResults=50&key=AIzaSyAP_ZKNpQqE0doSn3jj0aZ7lvxJTzlFVFU';

  if(pageToken){
    url += `&pageToken=${pageToken}`;
  }

  https.get(url, function(res) {
    let data = '';

    res.on('data', function(body) {
      data += body;
    });

    res.on('end', function() {
      let parsed = JSON.parse(data);
      let pageToken = parsed.nextPageToken;
      let items = parsed.items.filter(function(item){ return !!year(item.snippet.title); })
      playlists = playlists.concat(items);

      if(pageToken) {
        console.log('Getting page: ' + pageToken);

        getPlaylists(playlists, pageToken);
      } else {
        getVideos(playlists);
      }
    });

  }).on('error', function(e) {
    console.error(e);
    process.exit();
  });
}

index.setSettings({
  attributesToIndex: ['title', 'description', 'year', 'sbYear'],
  attributesForFaceting: ['year', 'sbYear'],
  customRanking: ['desc(year)'],
  numericAttributesToIndex: ['publishedAt']
});

getPlaylists([]);
