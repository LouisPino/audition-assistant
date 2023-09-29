"use strict";

const e = React.createElement;

const subdivArr = [
  "eightTest.jpeg",
  'triplets.png'
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


  render() {
    return (
      <main className="met-ctr">
        <label> Tempo</label>
        <input
          type="number"
          value={this.state.tempo}
          onChange={(e) => this.tempoChange(Number(e.target.value))}
          className="met-int-input"
        ></input>
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
        {this.state.running ? (
          <button onClick={this.stop} className="btn tempo-btn">
            Stop
          </button>
        ) : (
          <button onClick={this.start} className="btn tempo-btn">
            Start
          </button>
        )}
        <label>Beats per bar</label>
        <input
          type="number"
          value={this.state.beats}
          onChange={(e) => this.beatChange(Number(e.target.value))}
          className="met-int-input"
        ></input>
 <div className='subdiv-ctr'>
        <label>Subdivisions</label>
        <input
          type="number"
          value={this.state.divisor}
          onChange={(e) => this.divisorChange(Number(e.target.value))}
          className="met-int-input"
          max='8'
          min='2'
        ></input>
        <img className='subdiv-img' src={`../static/assets/${subdivArr[this.state.divisor-2]}`}/>
        </div>
{/*        
        <div className="sub-btns-ctr">
          <button
            className="btn sub-btn tempo-btn"
            onClick={() => this.divisorChange(2)}
          >
            8th
          </button>
          <button
            className="btn sub-btn tempo-btn"
            onClick={() => this.divisorChange(3)}
          >
            3let
          </button>
          <button
            className="btn sub-btn tempo-btn"
            onClick={() => this.divisorChange(4)}
          >
            16th
          </button>
          <button
            className="btn sub-btn tempo-btn"
            onClick={() => this.divisorChange(5)}
          >
            5let
          </button>
          <button
            className="btn sub-btn tempo-btn"
            onClick={() => this.divisorChange(6)}
          >
            6let
          </button>
          <button
            className="btn sub-btn tempo-btn"
            onClick={() => this.divisorChange(7)}
          >
            7let
          </button>
          <button
            className="btn sub-btn tempo-btn"
            onClick={() => this.divisorChange(8)}
          >
            32nd
          </button>
        </div> */}
        { !this.state.secondaryRunning ? 
        <button className="subdiv-btn" onClick={this.startSecondary}>Turn Subdivisions On</button>
        :
        <button className="subdiv-btn" onClick={this.stopSecondary}>Turn Subdivisions Off</button>
       }
        <input
          type="number"
          value={this.state.likelihood}
          className="met-int-input"
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
        <button className="taptempo-btn btn delete-btn" onClick={this.tapTempo}>
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

