$( document ).ready(function() {

  $('body').append('<div class="lightbox hidden"><a href="javascript:void(0)" class="close"><svg height="34px" id="Layer_1" style="enable-background:new 0 0 34 34;" version="1.1" viewBox="0 0 512 512" width="34px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M437.5,386.6L306.9,256l130.6-130.6c14.1-14.1,14.1-36.8,0-50.9c-14.1-14.1-36.8-14.1-50.9,0L256,205.1L125.4,74.5  c-14.1-14.1-36.8-14.1-50.9,0c-14.1,14.1-14.1,36.8,0,50.9L205.1,256L74.5,386.6c-14.1,14.1-14.1,36.8,0,50.9  c14.1,14.1,36.8,14.1,50.9,0L256,306.9l130.6,130.6c14.1,14.1,36.8,14.1,50.9,0C451.5,423.4,451.5,400.6,437.5,386.6z"/></svg></a><iframe class="lightbox_frame" type="text/html" width="640" height="385"></iframe>');

  $('#results').on('click', '.hit', function(a, e){
    var ytId = a.toElement.attributes[1].value.split('v=')[1];
    $('.lightbox_frame').attr('src','http://www.youtube.com/embed/'+ ytId);
    $('.lightbox').toggleClass('hidden');
  });

  $('.close').on('click', function(){
    $('.lightbox').addClass('hidden')
  });

  $('.sbx-custom__filters').on('click', function(e){
    $('.filters-panel').removeClass('hide');
    // $('main, header').addClass('blur');
    $('.container-fluid').addClass('no-scroll');
  });
  $('.filters-panel').on('click', function(e){
    // e.preventDefault()
    $(this).addClass('hide');
    // $('main, header').removeClass('blur');
    $('.container-fluid').removeClass('no-scroll');
  }).find('.searchbox').click(function(e) {
      return false;
  });


  $('#years').on('click', 'a', function(e){
    $('.ais-refinement-list--body').removeClass('hide');
  });

  $('#years').on('click', '.ais-refinement-list--body', function(e){
    $('.ais-refinement-list--body').addClass('hide');
  });


  $('#inception-filters .menu').on('click', function(e){
    // e.preventDefault()
    $(this).addClass('hide');
  }).find('.searchbox').click(function(e) {
      return false;
  });

});
