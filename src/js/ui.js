window.addEventListener('load', function(){

  // We start by creating the fancybox function
  var lightBox = function(param) {
    var item = param.item;
    var item = document.querySelectorAll(item);
    
    // add iframe
    var ifrContainer = document.createElement('div');
    var ifrClose = document.createElement('a');
    var ifr = document.createElement('iframe');
    ifrClose.classList.add('close');
    ifrClose.innerHTML='<svg height="50px" id="Layer_1" style="enable-background:new 0 0 50 50;" version="1.1" viewBox="0 0 512 512" width="50px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M437.5,386.6L306.9,256l130.6-130.6c14.1-14.1,14.1-36.8,0-50.9c-14.1-14.1-36.8-14.1-50.9,0L256,205.1L125.4,74.5  c-14.1-14.1-36.8-14.1-50.9,0c-14.1,14.1-14.1,36.8,0,50.9L205.1,256L74.5,386.6c-14.1,14.1-14.1,36.8,0,50.9  c14.1,14.1,36.8,14.1,50.9,0L256,306.9l130.6,130.6c14.1,14.1,36.8,14.1,50.9,0C451.5,423.4,451.5,400.6,437.5,386.6z"/></svg>';
    ifrContainer.classList.add('lightbox','hidden');
    ifr.setAttribute('type', 'text/html');
    ifr.setAttribute('width', '640');
    ifr.setAttribute('height', '385');
    ifr.classList.add('lightbox_frame');
    ifrContainer.appendChild(ifr);
    ifrContainer.appendChild(ifrClose);
    document.body.appendChild(ifrContainer);
    for(var i = 0, len = item.length; i < len; i++) {
      item[i].addEventListener('click', function(e){
        e.preventDefault();
        var itSrc = this.getAttribute('data-id').split('v=')[1];
        ifr.setAttribute('src', 'http://www.youtube.com/embed/'+itSrc);
        ifrContainer.classList.toggle('hidden');
      })
    }
    ifrClose.addEventListener('click', function(){
      ifrContainer.classList.toggle('hidden');
    })
  }

  // Then, we'll give an id to each video container
  // To help us identifying the video to play on the 
  // fancybox
  // And also, get rid of the hred
  var aisItem = document.querySelectorAll('.ais-hits--item > a');
  for(var i = 0, len = aisItem.length; i < len; i++) {
    aisItem[i].setAttribute('id','aisItem-'+i)
    aisItem[i].setAttribute('data-id', aisItem[i].href)
    aisItem[i].setAttribute('href', 'javascript:void(0)')
  }
 

  lightBox({
    item: '.ais-hits--item > a'
  })
});