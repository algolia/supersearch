// window.addEventListener('load', function(){

//   // We start by creating the fancybox function
//   var lightBox = function(param) {
//     var item = param.item;
//     var item = $(item);
    
//     // add iframe
//     var ifrContainer = $('body').append('div');
//     ifrContainer.addClass('lightbox','hidden');
//     var ifrClose = document.createElement('a');
//     var ifr = document.createElement('iframe');
//     ifrClose.classList.add('close');
//     ifrClose.innerHTML='<svg height="34px" id="Layer_1" style="enable-background:new 0 0 34 34;" version="1.1" viewBox="0 0 512 512" width="34px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M437.5,386.6L306.9,256l130.6-130.6c14.1-14.1,14.1-36.8,0-50.9c-14.1-14.1-36.8-14.1-50.9,0L256,205.1L125.4,74.5  c-14.1-14.1-36.8-14.1-50.9,0c-14.1,14.1-14.1,36.8,0,50.9L205.1,256L74.5,386.6c-14.1,14.1-14.1,36.8,0,50.9  c14.1,14.1,36.8,14.1,50.9,0L256,306.9l130.6,130.6c14.1,14.1,36.8,14.1,50.9,0C451.5,423.4,451.5,400.6,437.5,386.6z"/></svg>';
//     ifrContainer.classList.add('lightbox','hidden');
//     ifr.setAttribute('type', 'text/html');
//     ifr.setAttribute('width', '640');
//     ifr.setAttribute('height', '385');
//     ifr.classList.add('lightbox_frame');
//     ifrContainer.appendChild(ifr);
//     ifrContainer.appendChild(ifrClose);
//     document.body.appendChild(ifrContainer);

//     for(var i = 0, len = item.length; i < len; i++) {
//       item[i].addEventListener('click', function(e){
//         e.preventDefault();
//         var itSrc = this.getAttribute('dataid').split('v=')[1];
//         ifr.setAttribute('src', 'http://www.youtube.com/embed/'+itSrc);
//         ifrContainer.classList.toggle('hidden');
//       })
//     }
//     ifrClose.addEventListener('click', function(){
//       ifrContainer.classList.toggle('hidden');
//     })
//   }

//   // Then, we'll give an id to each video container
//   // To help us identifying the video to play on the 
//   // fancybox
//   // And also, get rid of the hred
//   var aisItem = document.querySelectorAll('.ais-hits--item > a');
//   for(var i = 0, len = aisItem.length; i < len; i++) {
//     aisItem[i].setAttribute('id','aisItem-'+i)
//     aisItem[i].setAttribute('data-id', aisItem[i].href)
//     aisItem[i].setAttribute('href', 'javascript:void(0)')
//   }
 

 
// });


$( document ).ready(function() {

  $('body').append('<div class="lightbox hidden"><a href="javascript:void(0)" class="close"><svg height="34px" id="Layer_1" style="enable-background:new 0 0 34 34;" version="1.1" viewBox="0 0 512 512" width="34px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M437.5,386.6L306.9,256l130.6-130.6c14.1-14.1,14.1-36.8,0-50.9c-14.1-14.1-36.8-14.1-50.9,0L256,205.1L125.4,74.5  c-14.1-14.1-36.8-14.1-50.9,0c-14.1,14.1-14.1,36.8,0,50.9L205.1,256L74.5,386.6c-14.1,14.1-14.1,36.8,0,50.9  c14.1,14.1,36.8,14.1,50.9,0L256,306.9l130.6,130.6c14.1,14.1,36.8,14.1,50.9,0C451.5,423.4,451.5,400.6,437.5,386.6z"/></svg></a><iframe class="lightbox_frame" type="text/html" width="640" height="385"></iframe>');

    $('#results').on('click', '.hit', function(a, e){
      var ytId = a.toElement.attributes[1].value.split('v=')[1];
      console.log(ytId)
      $('.lightbox_frame').attr('src','http://www.youtube.com/embed/'+ ytId)
      $('.lightbox').toggleClass('hidden');
    });
    $('.close').on('click', function(){
      $('.lightbox').addClass('hidden')
    });

    // Stick dat footer
    $('input').on('keyup keypress live change', function(){
      $('.ais-refinement-list--body').removeClass('open');
      $('#toggleFilter').text('Open filters');
      if($('.ais-hits').hasClass('ais-hits__empty')) {
        $('footer').css({
          position: 'absolute',
          bottom: '0'
        })
      } else {
        $('footer').css({
          position: 'relative',
          bottom: 'inherit'
        })
      }
    })

    $('.ais-refinement-list--header').on('click tap', $('#toggleFilter'), function(e){
      if($('.ais-refinement-list--body').hasClass('open')) {
        $('#toggleFilter').text('Open filters')
        $('.ais-refinement-list--body').removeClass('open');
      } else {
        $('#toggleFilter').text('Close filters')
        $('.ais-refinement-list--body').addClass('open');
      }
    })

});
