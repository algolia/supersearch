$('#results').on('click', '.hit', function(e){
  e.preventDefault();
  var yt = $(this).data('id');
  $('.lightbox_frame_wrapper').append($('<iframe class="lightbox_frame" type="text/html" width="640" height="385" allowfullscreen></iframe>'));
  $('.lightbox_frame').attr('src', 'http://www.youtube.com/embed/'+ yt + '?autoplay=1').load(function(){
    $(this).addClass('loaded');
  });
  $('.lightbox').toggleClass('hidden');
  $('body, html').css('overflow:hidden');
  $('.container-fluid').addClass('no-scroll');
});

function closeLightbox() {
  $('.lightbox_frame').remove();
  $('.lightbox').addClass('hidden');
  $('body, html').css('overflow:auto');
  $('.container-fluid').removeClass('no-scroll');
}

var $lightbox = $('<div class="lightbox hidden"><a href="javascript:void(0)" class="close"><svg height="34px" id="Layer_1" style="enable-background:new 0 0 34 34;" version="1.1" viewBox="0 0 512 512" width="34px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M437.5,386.6L306.9,256l130.6-130.6c14.1-14.1,14.1-36.8,0-50.9c-14.1-14.1-36.8-14.1-50.9,0L256,205.1L125.4,74.5  c-14.1-14.1-36.8-14.1-50.9,0c-14.1,14.1-14.1,36.8,0,50.9L205.1,256L74.5,386.6c-14.1,14.1-14.1,36.8,0,50.9  c14.1,14.1,36.8,14.1,50.9,0L256,306.9l130.6,130.6c14.1,14.1,36.8,14.1,50.9,0C451.5,423.4,451.5,400.6,437.5,386.6z"/></svg></a><div class="lightbox_frame_wrapper"></div>');

$lightbox.on('click', function(){
  closeLightbox();
});

$(document).keyup(function(e) {
   if (e.keyCode == 27 && $('.lightbox:not(.hidden)') != null) {
    closeLightbox();
  }
});

$('body').append($lightbox);

$('.sbx-custom__reset').on('click touchstart', function(e) {
  e.preventDefault();
  $(this).parent().find('input').val('').focus();
  search.helper.setQuery('').search();
});

$('.sbx-custom__filters').on('click touchstart', function(e){
  e.preventDefault();
  $('.filters-panel').removeClass('hide');
  $('.container-fluid').addClass('no-scroll');
  $('body, html').css('overflow:hidden');
});

$('.filters-panel').on('click', function(e){
  $(this).addClass('hide');
  $('body, html').css('overflow:auto');
  $('.container-fluid').removeClass('no-scroll');
}).find('.searchbox, .tabs').click(function(e) {
    return false;
});

$('.tabs a').on('click touchstart', function(e){
  e.preventDefault();
  e.stopPropagation();
  $('.tabs li a').toggleClass('active');
  $('.tab-panel').toggleClass('active');
});
