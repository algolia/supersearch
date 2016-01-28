'use strict';

let https         = require('https');
let algoliasearch = require('algoliasearch');
let async         = require('async');
let client        = algoliasearch('VC519DRAY3', process.env.ALGOLIA_API_KEY);
let index         = client.initIndex('sb_ads');
let brandsIndex   = client.initIndex('sb_ads_brands');

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

var allBrands = {};

function getVideos(playlists){
  async.each(playlists, cycleVideos, function() {
    updateBrandsIndex(allBrands)
  });
}

function cycleVideos(playlist, pageToken, cb) {
  let url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=' + playlist.id + '&key=AIzaSyAP_ZKNpQqE0doSn3jj0aZ7lvxJTzlFVFU';

  if(typeof pageToken === 'function') {
    cb = pageToken;
    pageToken = undefined;
  }

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

        var _brand = brand(item.snippet.title);
        var _brandID = _brand.replace(/[^\w]/g, '-');

        if(_brand.length > 0) {
          if(allBrands[_brandID]) {
            allBrands[_brandID].nbVideos++;
          } else {
            allBrands[_brandID] = {
              objectID: _brand.replace(/[^\w]/g, '-'),
              name: _brand,
              nbVideos: 1
            };
          }
        }

        return {
          objectID: item.snippet.resourceId.videoId,
          publishedAt: Date.parse(item.snippet.publishedAt)/1000,
          description: item.snippet.description,
          title: item.snippet.title,
          thumbnails: item.snippet.thumbnails,
          year: parseInt(year(item.snippet.title)),
          sbYear: sbYear(item.snippet.title),
          brand: _brand
        };
      });

      index.addObjects(items, function(err, content){
        if(err){
          return console.warn(err);
        }

        if(pageToken) {
          cycleVideos(playlist, pageToken, cb);
        } else {
          console.log('Got all videos for playlist ' + playlist.id)
          cb && cb();
          return;
        }
      })
    });
  });
}

function getPlaylists(playlists, pageToken){
  let url = 'https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=UCaDQC4iLWkq5Pkd1FRBnOuQ&maxResults=50&key=AIzaSyAP_ZKNpQqE0doSn3jj0aZ7lvxJTzlFVFU';

  if(pageToken){
    url += `&pageToken=${pageToken}`;
  } else {
    clearBrandsIndex();
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

function clearBrandsIndex() {
  brandsIndex.clearIndex(function(err, content){
    if(err){
      return console.warn(err);
    }

    return console.log('Cleared brands index');
  })
}

function updateBrandsIndex(brandsObject) {
  var brands = Object.keys(brandsObject).map(function(v) { return brandsObject[v]; });
  brandsIndex.saveObjects(brands, function(err, content){
    if(err){
      return console.warn(brands, err);
    }

    return console.log('Added '+brands.length+' objects to brands index');
  })
}

index.setSettings({
  attributesToIndex: ['title', 'description', 'year', 'sbYear'],
  attributesForFaceting: ['year', 'sbYear'],
  customRanking: ['desc(year)'],
  numericAttributesToIndex: ['publishedAt']
});

brandsIndex.setSettings({
  attributesToIndex: ['name'],
  customRanking: ['desc(nbVideos)']
})

getPlaylists([]);
