function openLightbox(e) {
  var yt = $(e).data('yt') || jHash.val('yt');
  jHash.val('yt', yt);

  $('.lightbox_frame_wrapper')
    .append($('<iframe class="lightbox_frame" type="text/html" width="640" height="385" allowfullscreen></iframe>'));
  $('.lightbox_frame').attr('src', 'https://www.youtube.com/embed/'+ yt + '?autoplay=1').load(function(){
    $(this).addClass('loaded');
  });
  $('.lightbox').toggleClass('hidden');
  $('body, html').css('overflow:hidden');
  $('.container-fluid').addClass('no-scroll');
  $(".lightbox .share-video").data('brand', $(e).data('brand'));
};

function closeLightbox() {
  $('.lightbox_frame').remove();
  $('.lightbox').addClass('hidden');
  $('body, html').css('overflow:auto');
  $('.container-fluid').removeClass('no-scroll');
  jHash.clearQuery();
};

// init
var yt = jHash.val('yt');
if (yt) {
  openLightbox();
};

$('#results').on('click', '.hit', function(e) {
  e.preventDefault();
  openLightbox(e.target);
});

$('.lightbox').on('click', function(){
  closeLightbox();
}).find('.lightbox_sharing').click(function(e) {
    return false;
});

$(document).keyup(function(e) {
   if (e.keyCode == 27 && $('.lightbox:not(.hidden)') != null) {
    closeLightbox();
  }
});

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

$(".share-link").on("click", function(e) {
  e.preventDefault();
  var e = "https://community.algolia.com/supersearch/"
    , n = "Never struggle to find a #SuperBowl ad again. Find the good, the bad and the @Nationwide.";
  switch (this.href.split("#")[1]) {
  case "twitter":
    window.open("https://twitter.com/share?url=" + encodeURIComponent(e) + "&text=" + encodeURIComponent(n) + "&via=algolia", "", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600");
    break;
  case "facebook":
    window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(e) + "&t=" + encodeURIComponent(n), "", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600");
    break;
  }
});

$(".share-video").on("click", function(e) {
  e.preventDefault();
  var yt = jHash.val('yt');
  var brand = $(this).data('brand');
  var e = "https://community.algolia.com/supersearch/#?yt=" + yt
    , n = "I ❤ this #SuperBowl #ad by " + brand + " on 🏈 SuperSearch Commercials 🏈 ";
    switch (this.href.split("#")[1]) {
    case "twitter":
      window.open("https://twitter.com/share?url=" + encodeURIComponent(e) + "&text=" + encodeURIComponent(n) + "&via=algolia", "", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600");
      break;
    case "facebook":
      window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(e) + "&t=" + encodeURIComponent(n), "", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600");
      break;
    }
});
