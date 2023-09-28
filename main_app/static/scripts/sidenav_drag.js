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
    console.log(divOverlay.getBoundingClientRect().width)
    if (isDown) {
        divOverlay.style.left = (e.clientX + offset) + 'px'
        divOverlay.style.width = (document.body.clientWidth - Number(divOverlay.style.left.split('px')[0]))+'px'
    }  
    if(divOverlay.getBoundingClientRect().width < 301 || divOverlay.getBoundingClientRect().width > 1000){
      isDown=false
} 
}, true);