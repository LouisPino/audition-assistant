'use strict';

 const e = React.createElement;


class LikeButton extends React.Component {
   constructor(props) {
     super(props);
     this.state = { 
      tempo: 120, 
      running: false,
      timeSinceTap: 0,
      tapTime: 0,
      tapCount: 0,
    tapTimeTotal: 0};
   }



  start=()=> {
      this.setState({running: true})
      this.playMet();
      clickSound.play();
  }

  reset=()=> {
      clearInterval(metLoop);
      this.playMet();
  }
    
    
  stop=()=> {
      this.setState({running: false})
      clearInterval(metLoop);
      clearInterval(secondaryMetLoop);
  }


  playMet=()=> {
      running = true;
      tempoMs = 60000 / this.state.tempo;
      metLoop = setInterval(function () {
        clickSound.currentTime = 0;
        if(random){
        if(Math.random() <= likelihood){
        clickSound.play()}}
        else{clickSound.play()}
      }, tempoMs);
    }

  tempoChange=(newTemp)=>{
  this.setState({tempo: newTemp})
  // this.reset()
  console.log(this.state.tempo)
  }

  tempoIncrement=(int)=>{
    let newTemp = this.state.tempo+int
    if (newTemp >= 20 && newTemp <= 400){
    this.setState({tempo: this.state.tempo+int})
    }
  }


  tapTempo=()=>{
    let lastTime = this.state.tapTime
    let time = Date.now()
    this.setState({timeSinceTap: time-lastTime, tapTime: time})
   let newTemp = this.getAverageTime()
    if(typeof(newTemp)==='number'){
    this.setState({tempo: Math.floor(newTemp)}
      )
  }
  }
  getAverageTime=()=>{
    if (this.state.timeSinceTap > 3000){
      this.setState({tapCount: 0, tapTimeTotal: 0})
      console.log(this.state.tapTimeTotal)
  }else{
      this.setState({tapCount: this.state.tapCount+1, tapTimeTotal: this.state.tapTimeTotal+this.state.timeSinceTap})
      let avg = this.state.tapTimeTotal / this.state.tapCount
      if(avg){
        return 60000/avg
      }
    }
  }

   render() {  
    return (
   <main>
    <input type="number" value={this.state.tempo} onChange={(e)=>this.tempoChange(Number(e.target.value))} className="tempo-input"></input>
   {this.state.running ? <button onClick={this.stop} className="tempo-btn">Stop</button> : <button onClick={this.start} className="tempo-btn">Start</button>}
    <button className="minus-ten tempo-btn" onClick={()=>this.tempoIncrement(-10)}>-10</button>
    <button className="minus-five tempo-btn" onClick={()=>this.tempoIncrement(-5)}>-5</button>
    <button className="plus-five tempo-btn" onClick={()=>this.tempoIncrement(5)}>+5</button>
    <button className="plus-ten tempo-btn" onClick={()=>this.tempoIncrement(10)}>+10</button>
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
    <button className="taptempo-btn" onClick={this.tapTempo}>Tap Tempo</button>
</main>
    )
 }
}
 const domContainer = document.querySelector('#like_button_container');
 ReactDOM.render(<LikeButton />, domContainer);




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
let divisor = 2
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
subBtnEls.forEach(function(subBtnEl){
  subBtnEl.addEventListener('click', subdivisions)
})

////////////////functions
/////////Start/Stop


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



function secondaryStop() {
  secondaryRunning = false

  subdivBtnEl.removeEventListener("click", secondaryStop);
  subdivBtnEl.addEventListener("click", secondaryStart);
  clearInterval(secondaryMetLoop);
}

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

