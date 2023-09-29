"use strict";

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

  start = () => {
    this.setState({ running: true });
    this.playMet();
    clickSound.play();
  };


  reset = () => {
    if (this.state.running) {
      clearInterval(metLoop);
      clearInterval(secondaryMetLoop);
      this.playMet();
    }
  };

  stop = () => {
    this.setState({ running: false });
    clearInterval(metLoop);
    clearInterval(secondaryMetLoop);
  };

  playMet = () => {
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
      if (random) {
        if (beatCount === 0) {
          if (Math.random() < like / 100) {
            clickSound.play();
          }
        } else {
          if (Math.random() < like / 100) {
            clickSound2.play();
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
    if (newTemp >= 20 && newTemp <= 400) {
      await this.promisedSetState({ tempo: newTemp });
    }
    this.reset();
  };

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
  console.log(metLoop)
   await  this.promisedSetState({ secondaryRunning: false });
    clearInterval(secondaryMetLoop)
    this.reset()
  };

  // playSecondaryMet=()=>{
  //   let random = this.state.random;
  //   let like = this.state.likelihood;
  //   let divisor = this.state.divisor
  //   let subTempoMs = 60000 / this.state.tempo / divisor
  //   let subCount = 0

  //   secondaryMetLoop = setInterval(function () {
  //     clickSound3.currentTime = 0;
  //     if (random) {
  //       if (subCount !== 0) {
  //         if (Math.random() < like / 100) {
  //           clickSound3.play();
  //         }
  //       }
  //       if (divisor === subCount + 1) {
  //         subCount = 0;
  //       } else {
  //         subCount++;
  //       }
  //     } 
      
  //     else {
  //       console.log(subCount)
  //       if (subCount !== 0) {
  //           clickSound3.play();
  //         }
  //       }
  //       if (divisor === subCount + 1) {
  //         subCount = 0;
  //       } else {
  //         subCount++;
  //       }
  //   }, subTempoMs);

  // }


  render() {
    return (
      <main>
        <label> Tempo</label>
        <input
          type="number"
          value={this.state.tempo}
          onChange={(e) => this.tempoChange(Number(e.target.value))}
          className="tempo-input"
        ></input>
        <label>Beats per bar</label>
        <input
          type="number"
          value={this.state.beats}
          onChange={(e) => this.beatChange(Number(e.target.value))}
          className="tempo-input"
        ></input>
        {this.state.running ? (
          <button onClick={this.stop} className="tempo-btn">
            Stop
          </button>
        ) : (
          <button onClick={this.start} className="tempo-btn">
            Start
          </button>
        )}
        <button
          className="minus-ten tempo-btn"
          onClick={() => this.tempoIncrement(-10)}
        >
          -10
        </button>
        <button
          className="minus-five tempo-btn"
          onClick={() => this.tempoIncrement(-5)}
        >
          -5
        </button>
        <button
          className="plus-five tempo-btn"
          onClick={() => this.tempoIncrement(5)}
        >
          +5
        </button>
        <button
          className="plus-ten tempo-btn"
          onClick={() => this.tempoIncrement(10)}
        >
          +10
        </button>
        <div className="sub-btns-ctr">
          <button
            className="sub-btn tempo-btn"
            onClick={() => this.divisorChange(2)}
          >
            8th
          </button>
          <button
            className="sub-btn tempo-btn"
            onClick={() => this.divisorChange(3)}
          >
            3let
          </button>
          <button
            className="sub-btn tempo-btn"
            onClick={() => this.divisorChange(4)}
          >
            16th
          </button>
          <button
            className="sub-btn tempo-btn"
            onClick={() => this.divisorChange(5)}
          >
            5let
          </button>
          <button
            className="sub-btn tempo-btn"
            onClick={() => this.divisorChange(6)}
          >
            6let
          </button>
          <button
            className="sub-btn tempo-btn"
            onClick={() => this.divisorChange(7)}
          >
            7let
          </button>
          <button
            className="sub-btn tempo-btn"
            onClick={() => this.divisorChange(8)}
          >
            32nd
          </button>
        </div>
        <input
          type="number"
          value={this.state.likelihood}
          className="random-input"
          onChange={(e) => this.likelihoodChange(Number(e.target.value))}
        />
        {this.state.random ? (
          <button className="random-btn" onClick={() => this.randomToggle(0)}>
            Turn Random Off
          </button>
        ) : (
          <button className="random-btn" onClick={() => this.randomToggle(1)}>
            Turn Random On
          </button>
        )}
       { !this.state.secondaryRunning ? 
        <button className="subdiv-btn" onClick={this.startSecondary}>Turn Subdivisions On</button>
        :
        <button className="subdiv-btn" onClick={this.stopSecondary}>Turn Subdivisions Off</button>
       }
        <button className="taptempo-btn" onClick={this.tapTempo}>
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
let secondaryRunning;
let metLoop;
let secondaryMetLoop;

let secondaryTempoMs;

//////event listeners

////////////////functions
/////////Start/Stop

function playSecondaryMet() {
  secondaryRunning = true;
  secondaryTempoMs = 60000 / tempo / divisor;
  secondaryMetLoop = setInterval(function () {
    clickSound2.currentTime = 0;
    if (random) {
      if (Math.random() <= likelihood) {
        clickSound2.play();
      }
    } else {
      clickSound2.play();
    }
  }, secondaryTempoMs);
}

function secondaryStop() {
  secondaryRunning = false;
  subdivBtnEl.removeEventListener("click", secondaryStop);
  subdivBtnEl.addEventListener("click", secondaryStart);
  clearInterval(secondaryMetLoop);
}

/////change tempo

function subdivisions(e) {
  divisor = e.target.getAttribute("divisor");
  if (running) {
    reset();
  }
}
