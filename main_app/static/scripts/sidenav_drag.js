var offset = 0
var divOverlay = document.querySelector("#slide-out");
var isDown = false;
divOverlay.addEventListener('mousedown', function(e) {
    isDown = true;
    offset = divOverlay.offsetLeft - e.clientX
}, true);


document.addEventListener('mouseup', function() {
    isDown = false;
}, true);
document.addEventListener('mousemove', function(e) {
    if (isDown) {
        divOverlay.style.left = (e.clientX + offset) + 'px'
        divOverlay.style.width = (document.body.clientWidth - Number(divOverlay.style.left.split('px')[0]))+'px'
    }  
    if(divOverlay.getBoundingClientRect().width < 299 || divOverlay.getBoundingClientRect().width > 1000){
    //   isDown=false
      if(divOverlay.getBoundingClientRect().width > 900){
          oldWidth = Number(divOverlay.style.width.split('px')[0])
          divOverlay.style.width = '995px'
          divOverlay.style.left =  Number(divOverlay.style.left.split('px')[0])-(995-oldWidth) + 'px'
      }else{
        if(e.clientX > document.body.clientWidth - 100){isDown=false}
      oldWidth = Number(divOverlay.style.width.split('px')[0])
      divOverlay.style.width = '305px'
      divOverlay.style.left =  Number(divOverlay.style.left.split('px')[0])-(305-oldWidth) + 'px'
} }
}, true);