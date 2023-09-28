'use strict';

 const e = React.createElement;
 
 class LikeButton extends React.Component {
   constructor(props) {
     super(props);
     this.state = { tempo: 180 };
   }
 
   render() {  
    return (
   <main>
    <button className="minus-ten tempo-btn">-10</button>
    <button className="minus-five tempo-btn">-5</button>
    <input type="number" placeholder="120" className="tempo-input"/>
    <button className="plus-five tempo-btn">+5</button>
    <button className="plus-ten tempo-btn">+10</button>
    <button className="start-btn tempo-btn">Start</button>
    <div className="sub-btns-ctr">
    <button className="sub-btn tempo-btn" divisor="2">8th</button>
    <button className="sub-btn tempo-btn" divisor="3">3let</button>
    <button className="sub-btn tempo-btn" divisor="4">16th</button>
    <button className="sub-btn tempo-btn" divisor="5">5let</button>
    <button className="sub-btn tempo-btn" divisor="6">6let</button>
    <button className="sub-btn tempo-btn" divisor="7">7let</button>
    <button className="sub-btn tempo-btn" divisor="8">32nd</button>
  </div>
    <input type="number" placeholder="100" className="random-input"/>
    <button className="random-btn">Turn Random On</button>
    <button className="subdiv-btn">Turn Subdivisions On</button>
</main>
    )
 }
}
 const domContainer = document.querySelector('#like_button_container');
 ReactDOM.render(<LikeButton />, domContainer);




 ////////////////////////variables
///////cached elements
const inputEl = document.querySelector(".tempo-input");
const randomInputEl = document.querySelector(".random-input");
const randomBtnEl = document.querySelector(".random-btn");
const subdivBtnEl = document.querySelector(".subdiv-btn");
const startEl = document.querySelector(".start-btn");
const minusTenEl = document.querySelector(".minus-ten");
const plusTenEl = document.querySelector(".plus-ten");
const minusFiveEl = document.querySelector(".minus-five");
const plusFiveEl = document.querySelector(".plus-five");
const subBtnEls = document.querySelectorAll(".sub-btn");
///////Constants
const clickSound = new Audio("../static/assets/clave.wav");
const clickSound2 = new Audio("../static/assets/clave3.wav");
const clickSound3 = new Audio("../static/assets/clave.wav");

///////Variables
let running = false;
let secondaryRunning
let tempo = 120;
let tempoMs = 60000 / tempo;
let divisor
let metLoop;
let secondaryMetLoop
let likelihood = 1
let random = false
let secondaryTempoMs 

//////event listeners
inputEl.addEventListener("input", inputTempo);
randomBtnEl.addEventListener("click", randomToggle);
randomInputEl.addEventListener("input", likelihoodChange);
subdivBtnEl.addEventListener("click", secondaryStart);
startEl.addEventListener("click", start);
minusTenEl.addEventListener("click", minusTen);
plusTenEl.addEventListener("click", plusTen);
minusFiveEl.addEventListener("click", minusFive);
plusFiveEl.addEventListener("click", plusFive);
// document.addEventListener("keydown", keyPress);
subBtnEls.forEach(function(subBtnEl){
  subBtnEl.addEventListener('click', subdivisions)
})

////////////////functions
/////////Start/Stop
function playMet() {
  running = true;
  tempoMs = 60000 / tempo;
  metLoop = setInterval(function () {
    clickSound.currentTime = 0;
    if(random){
    if(Math.random() <= likelihood){
    clickSound.play()}}
    else{clickSound.play()}
  }, tempoMs);
}

function playSecondaryMet() {
  secondaryRunning = true;
  secondaryTempoMs = 60000 / tempo / divisor;
  secondaryMetLoop = setInterval(function () {
    clickSound2.currentTime = 0;
    if(random){
    if(Math.random() <= likelihood){
    clickSound2.play()}}
    else{clickSound2.play()}
  }, secondaryTempoMs);
}

function secondaryStart() {
  subdivBtnEl.innerHTML = "Turn Off Subdivisions";
  subdivBtnEl.removeEventListener("click", secondaryStart);
  subdivBtnEl.addEventListener("click", secondaryStop);
  clickSound2.play();
  playSecondaryMet();
}

function start() {
    if(!inputEl.value){inputEl.value = tempo}
  startEl.innerHTML = "Stop";
  startEl.removeEventListener("click", start);
  startEl.addEventListener("click", stop);
  clickSound.play();
  playMet();
}

function reset() {
  clearInterval(metLoop);
  playMet();
}

function stop() {
  running = false;
  secondaryRunning = false
  startEl.innerHTML = "Start";
  startEl.removeEventListener("click", stop);
  startEl.addEventListener("click", start);
  clearInterval(metLoop);
  clearInterval(secondaryMetLoop);
}

function secondaryStop() {
  secondaryRunning = false

  subdivBtnEl.removeEventListener("click", secondaryStop);
  subdivBtnEl.addEventListener("click", secondaryStart);
  clearInterval(secondaryMetLoop);
}

// function keyPress(e){
//     if(!running){
//     if(e.code === 'Enter' || e.code === 'Space'){
//         e.preventDefault()
//         start()
//     }
// }else{
//     if(e.code === 'Enter' || e.code === 'Space'){
//         e.preventDefault()
//         stop()
//     }
// }
// }


/////change tempo
function minusTen() {
  if (tempo >= 30) {
    changeBy(-10);
  }
}

function plusTen() {
  if (tempo <= 490) {
    changeBy(10);
  }
}

function minusFive() {
  if (tempo >= 25) {
    changeBy(-5);
  }
}

function plusFive() {
  if (tempo <= 495) {
    changeBy(5);
  }
}

function changeBy(val) {
  tempo += val;
  inputEl.value = `${tempo}`;
  if (running) reset();
}

function inputTempo(e) {
    if (e.target.value > 10 && e.target.value <= 500) {
      tempo = Number(e.target.value);
      tempoMs = 60000 / e.target.value;
      if (running) {
        reset();
      }
    }
  }

  function subdivisions(e){
    divisor = e.target.getAttribute('divisor')
    if (running) {
      reset();
    }
  }


////////random 
function likelihoodChange(e){
    likelihood = e.target.value/100
}

function randomToggle(){
    if(!random){random = true
    randomBtnEl.innerHTML = 'Turn Random Off'}
    else{random = false
        randomBtnEl.innerHTML = 'Turn Random On'}
}

