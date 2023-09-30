"use strict";

const e = React.createElement;

const subdivArr = [
  "2.png",
  '3.png',
  '4.png',
  '5.png',
  '6.png',
  '7.png',
  '8.png'
  ]

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempo: 120,
      running: false,
      timeSinceTap: 0,
      tapTime: 0,
      tapCount: 0,
      tapTimeTotal: 0,
      likelihood: 100,
      random: false,
      beats: 1,
      divisor: 2,
      secondaryRunning: false,
      subs: 0,
      secondaryMetLoop
    };
  }
  promisedSetState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));


  reset = () => {
    if (this.state.running) {
      clearInterval(metLoop);
      clearInterval(secondaryMetLoop);
      ballEl.style.animation = 'none'
      this.playMet();
    }
  };

  stop = () => {
    this.setState({ running: false });
    clearInterval(metLoop);
    clearInterval(secondaryMetLoop);
    ballEl.style.animation = 'none'
  };

  playMet = () => {

    if (!this.state.tempo){
      return}
      this.setState({ running: true });
      let beats = this.state.beats;
      let random = this.state.random;
      let like = this.state.likelihood;
      let tempoMs = 60000 / this.state.tempo;
      let beatCount = 0;
      let secondaryRunning = this.state.secondaryRunning;
      let divisor = this.state.divisor
      let subTempoMs = 60000 / this.state.tempo / divisor
      let subCount = 0
      metLoop = setInterval(function () {
        clickSound.currentTime = 0;
        ballEl.style.animation = `slide ${tempoMs * 2}ms ease-out infinite`
        if (random) {
          if (beatCount === 0) {
            clearInterval(secondaryMetLoop)
          if (Math.random() < like / 100) {
            clickSound.play();
            subCount = 0
            if(secondaryRunning){
              secondaryMetLoop = setInterval(function () {
                if(subCount!== divisor-1){
                  clickSound3.currentTime = 0;
                  clickSound3.play()
                }
                subCount++
              }, subTempoMs)
  
            }
          }
        } else {
          clearInterval(secondaryMetLoop)
          if (Math.random() < like / 100) {
            clickSound2.play();
          subCount = 0
          if(secondaryRunning){
            secondaryMetLoop = setInterval(function () {
              if(subCount!== divisor-1){
                clickSound3.currentTime = 0;
                clickSound3.play()
              }
              subCount++
            }, subTempoMs)

          }
          }
        }
        if (beats === beatCount + 1) {
          beatCount = 0;
        } else {
          beatCount++;
        }
     
      } else {
        if (beatCount === 0) {
          clickSound.play();
          subCount = 0
          clearInterval(secondaryMetLoop)
          if(secondaryRunning){
            secondaryMetLoop = setInterval(function () {
              if(subCount!== divisor-1){
                clickSound3.currentTime = 0;
                clickSound3.play()
              }
              subCount++
            }, subTempoMs)
          }
        } else {
          clickSound2.play();
          subCount = 0
          clearInterval(secondaryMetLoop)
          if(secondaryRunning){
            secondaryMetLoop = setInterval(function () {
              if(subCount!== divisor-1){
                clickSound3.currentTime = 0;
                clickSound3.play()
              }
              subCount++
            }, subTempoMs)
          }
        }
        if (beats === beatCount + 1) {
          beatCount = 0;
        } else {
          beatCount++;
        }
      }
    }, tempoMs);
  };

  tempoChange = async (newTemp) => {
    if (newTemp !== 0){
      await this.promisedSetState({ tempo: newTemp });
     this.reset();
  }else{await this.promisedSetState({ tempo: undefined })}
  }

  tempoIncrement = (int) => {
    let newTemp = this.state.tempo + int;
    if (newTemp >= 20 && newTemp <= 400) {
      this.tempoChange(newTemp);
    }
  };

  tapTempo = () => {
    let lastTime = this.state.tapTime;
    let time = Date.now();
    this.setState({ timeSinceTap: time - lastTime, tapTime: time });
    let newTemp = this.getAverageTime();
    if (typeof newTemp === "number") {
      this.tempoChange(Math.floor(newTemp));
    }
  };
  getAverageTime = () => {
    if (this.state.timeSinceTap > 3000) {
      this.setState({ tapCount: 0, tapTimeTotal: 0 });
    } else {
      this.setState({
        tapCount: this.state.tapCount + 1,
        tapTimeTotal: this.state.tapTimeTotal + this.state.timeSinceTap,
      });
      let avg = this.state.tapTimeTotal / this.state.tapCount;
      if (avg) {
        return 60000 / avg;
      }
    }
  };

  likelihoodChange = async (like) => {
    let random = this.state.random;
    let newLike = like;
    if (newLike <= 100 && newLike >= 0) {
      await this.promisedSetState({ likelihood: newLike });
    }
    if (random) {
      this.reset();
    }
  };

  randomToggle = async (x) => {
    let newRandom = x;
    await this.promisedSetState({ random: !!newRandom });
    this.reset();
  };

  beatChange = async (beats) => {
    if (beats >= 1 && beats <= 16) {
      await this.promisedSetState({ beats: beats });
      this.reset();
    }
  };

  divisorChange = async (div) => {
    await this.promisedSetState({ divisor: div });
    this.reset();
  };


  startSecondary = async() => {
   await  this.promisedSetState({ secondaryRunning: true });
    this.reset()
  };

  stopSecondary = async() => {
   await  this.promisedSetState({ secondaryRunning: false });
    clearInterval(secondaryMetLoop)
    this.reset()
  };


  render() {
    return (
      <main className="met-ctr">
        <div className='met-anim'>
        <div className='met-anim-ball'>
          </div>
          </div>


         {this.state.running ? (
          <button onClick={this.stop} className="btn tempo-btn">
            Stop
          </button>
        ) : (
          <button onClick={this.playMet} className="btn tempo-btn">
            Start
          </button>
        )}
        <div className='met-field-ctr'>
        <label> Tempo</label>
        <input
          type="number"
          value={this.state.tempo}
          onChange={(e) => this.tempoChange(Number(e.target.value))}
          className="met-int-input"
        ></input>
        </div>
        <div className='tempo-btn-ctr'>
        <button
          className="btn minus-ten tempo-btn"
          onClick={() => this.tempoIncrement(-10)}
        >
          -10
        </button>
        <button
          className="btn minus-five tempo-btn"
          onClick={() => this.tempoIncrement(-5)}
        >
          -5
        </button>
        <button
          className="btn plus-five tempo-btn"
          onClick={() => this.tempoIncrement(5)}
        >
          +5
        </button>
        <button
          className="btn plus-ten tempo-btn"
          onClick={() => this.tempoIncrement(10)}
        >
          +10
        </button>
        </div>
        <hr className='met-hr'/>

        <div className='met-field-ctr'>
        <label>Beats per bar</label>
        <input
          type="number"
          value={this.state.beats}
          onChange={(e) => this.beatChange(Number(e.target.value))}
          className="met-int-input"
        ></input>
      </div>
  <hr className='met-hr'/>

 <div className='met-field-ctr'>
          <label>Subdivisions</label>
        <input
          type="number"
          value={this.state.divisor}
          onChange={(e) => this.divisorChange(Number(e.target.value))}
          className="met-int-input"
          max='8'
          min='2'
        ></input>
        </div>
        <img className='subdiv-img' src={`../static/assets/${subdivArr[this.state.divisor-2]}`}/>
        { !this.state.secondaryRunning ? 
        <button className="subdiv-btn btn" onClick={this.startSecondary}>Turn Subdivisions On</button>
        :
        <button className="subdiv-btn btn" onClick={this.stopSecondary}><p>Turn Subdivisions Off</p></button>
      }
      <hr className='met-hr'/>

        
        <div className="random-input-ctr">
        <label>Random %</label>
        <input
          type="number"
          value={this.state.likelihood}
          className="met-int-input"
          onChange={(e) => this.likelihoodChange(Number(e.target.value))}
        />
        </div>
        {this.state.random ? (
          <button className="random-btn btn" onClick={() => this.randomToggle(0)}>
            Turn Random Off
          </button>
        ) : (
          <button className="random-btn btn" onClick={() => this.randomToggle(1)}>
            Turn Random On
          </button>
        )}
         <hr className='met-hr'/>

        <button id='taptempo-btn' className="btn " onClick={this.tapTempo}>
          Tap Tempo
        </button>
      </main>
    );
  }
}
const domContainer = document.querySelector("#like_button_container");
ReactDOM.render(<LikeButton />, domContainer);

///////cached elements
///////Constants
const clickSound = new Audio("../static/assets/clave.wav");
const clickSound2 = new Audio("../static/assets/clave2.wav");
const clickSound3 = new Audio("../static/assets/clave3.wav");

///////Variables
let metLoop;
let secondaryMetLoop;

const ballEl = document.querySelector('.met-anim-ball')



