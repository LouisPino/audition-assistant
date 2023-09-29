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
    if (document.body.clientWidth > 450){
        console.log('hi')
    if (isDown) {
        divOverlay.style.left = (e.clientX + offset) + 'px'
        divOverlay.style.width = (document.body.clientWidth - Number(divOverlay.style.left.split('px')[0]))+'px'
    }  
    if(divOverlay.getBoundingClientRect().width < 299 || divOverlay.getBoundingClientRect().width > document.body.clientWidth/3*2){
      if(divOverlay.getBoundingClientRect().width > document.body.clientWidth/3*2-10){
          oldWidth = Number(divOverlay.style.width.split('px')[0])
          divOverlay.style.width = document.body.clientWidth/3*2-10 +'px'
          divOverlay.style.left =  Number(divOverlay.style.left.split('px')[0])-(document.body.clientWidth/3*2-10-oldWidth) + 'px'
      }else{
        if(e.clientX > document.body.clientWidth - 100){isDown=false}
      oldWidth = Number(divOverlay.style.width.split('px')[0])
      divOverlay.style.width = '305px'
      divOverlay.style.left =  Number(divOverlay.style.left.split('px')[0])-(305-oldWidth) + 'px'
} }}
}, true);