"use strict";
const e = React.createElement;
class Metronome extends React.Component {
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
      ternaryRunning: false,
      polyTop: 2,
      polyBottom: 2,
    };
  }
  promisedSetState = (newState) =>
    new Promise((resolve) => this.setState(newState, resolve));

  reset = () => {
    if (this.state.running) {
      clearInterval(metLoop);
      clearInterval(secondaryMetLoop);
      clearInterval(ternaryMetLoop);
      ballEl.style.animation = "none";
      this.playMet();
    }
  };

  stop = () => {
    this.setState({ running: false });
    clearInterval(metLoop);
    clearInterval(secondaryMetLoop);
    clearInterval(ternaryMetLoop);
    ballEl.style.animation = "none";
  };

  //main loop
  playMet = () => {
    if (!this.state.tempo) {
      return;
    }
    this.setState({ running: true });
    let beats = this.state.beats;
    let random = this.state.random;
    let like = this.state.likelihood;
    let tempoMs = 60000 / this.state.tempo;
    let beatCount = 0;
    let secondaryRunning = this.state.secondaryRunning;
    let ternaryRunning = this.state.ternaryRunning;
    let polyCount = 0;
    let playTernary = this.playTernary;
    let playSecondary = this.playSecondary;
    metLoop = setInterval(function () {
      ballEl.style.animation = `slide ${tempoMs * 2}ms ease-out infinite`;
      if (ternaryRunning && polyCount === 0) {
        clearInterval(ternaryMetLoop);
        playTernary();
      }
      polyCount++;
      if (beatCount === 0) {
        clearInterval(secondaryMetLoop);
        if (random) {
          if (Math.random() < like / 100) {
            clave.play();
          }
        } else {
          clave.play();
        }
        if (secondaryRunning) {
          playSecondary();
        }
      } else {
        clearInterval(secondaryMetLoop);
        if (random) {
          if (Math.random() < like / 100) {
            clave2.play();
          }
        } else {
          clave2.play();
        }
        if (secondaryRunning) {
          playSecondary();
        }
      }
      if (beats === beatCount + 1) {
        beatCount = 0;
      } else {
        beatCount++;
        console.log(beatCount, "hit");
      }
    }, tempoMs);
  };

  tempoChange = async (newTemp) => {
    if (newTemp !== 0) {
      await this.promisedSetState({ tempo: newTemp });
      this.reset();
    } else {
      await this.promisedSetState({ tempo: undefined });
    }
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

  startSecondary = async () => {
    await this.promisedSetState({ secondaryRunning: true });
    this.reset();
  };

  stopSecondary = async () => {
    await this.promisedSetState({ secondaryRunning: false });
    clearInterval(secondaryMetLoop);
    this.reset();
  };

  startTernary = async () => {
    await this.promisedSetState({ ternaryRunning: true });
    this.reset();
  };

  stopTernary = async () => {
    await this.promisedSetState({ ternaryRunning: false });
    clearInterval(ternaryMetLoop);
    this.reset();
  };

  polyTopChange = async (int) => {
    await this.promisedSetState({ polyTop: int });
    this.reset();
  };

  polyBottomChange = async (int) => {
    await this.promisedSetState({ polyBottom: int });
    this.reset();
  };

  playTernary = () => {
    let like = this.state.likelihood;
    let random = this.state.random;
    let ternaryTempoMs =
      (60000 / this.state.tempo / this.state.polyBottom) * this.state.polyTop;
    clave4.play();
    ternaryMetLoop = setInterval(() => {
      if (random) {
        if (Math.random() < like / 100) {
          clave4.play();
        }
      } else {
        clave4.play();
      }
    }, ternaryTempoMs);
  };

  playSecondary = () => {
    let like = this.state.likelihood;
    let random = this.state.random;
    let divisor = this.state.divisor;
    let subTempoMs = 60000 / this.state.tempo / divisor;
    let subCount = 0;
    secondaryMetLoop = setInterval(function () {
      if (subCount !== divisor - 1) {
        if (random) {
          if (Math.random() < like / 100) {
            clave3.play();
          }
        } else {
          clave3.play();
        }
      }
      subCount++;
    }, subTempoMs);
  };

  render() {
    return (
      <main className="met-ctr">
        <div className="met-anim">
          <div className="met-anim-ball"></div>
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

        {document.body.clientWidth < 450 && (
          <label>Phone must be off silent mode!</label>
        )}
        <div className="met-field-ctr">
          <label> Tempo</label>
          <input
            type="number"
            value={this.state.tempo}
            onChange={(e) => this.tempoChange(Number(e.target.value))}
            className="met-int-input"
          ></input>
        </div>
        <div className="tempo-btn-ctr">
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
        <hr className="met-hr" />

        <div className="met-field-ctr">
          <label>Beats per bar</label>
          <input
            type="number"
            value={this.state.beats}
            onChange={(e) => this.beatChange(Number(e.target.value))}
            className="met-int-input"
          ></input>
        </div>
        <hr className="met-hr" />
        <div className="subdiv-poly-ctr">
          <div className="subdiv-ctr">
            <label>Subdivisions</label>
            <img
              className="subdiv-img"
              src={`${assetsPath}${this.state.divisor}.png`}
            />
            <input
              type="number"
              value={this.state.divisor}
              onChange={(e) => this.divisorChange(Number(e.target.value))}
              className="met-int-input"
              max="8"
              min="2"
            ></input>
            {!this.state.secondaryRunning ? (
              <button className="subdiv-btn btn" onClick={this.startSecondary}>
                Turn Subdivisions On
              </button>
            ) : (
              <button className="subdiv-btn btn" onClick={this.stopSecondary}>
                Turn Subdivisions Off
              </button>
            )}
          </div>
          <div className="vr"></div>
          <div className="poly-ctr">
            <label>Polyrhythms</label>
            <input
              type="number"
              value={this.state.polyTop}
              onChange={(e) => this.polyTopChange(Number(e.target.value))}
              className="met-int-input"
              max="8"
              min="2"
            ></input>
            <label>:</label>
            <input
              type="number"
              value={this.state.polyBottom}
              onChange={(e) => this.polyBottomChange(Number(e.target.value))}
              className="met-int-input"
              max="8"
              min="2"
            ></input>
            {!this.state.ternaryRunning ? (
              <button className="poly-btn btn" onClick={this.startTernary}>
                Turn Polyrhythms On
              </button>
            ) : (
              <button className="poly-btn btn" onClick={this.stopTernary}>
                Turn Polyrhythms Off
              </button>
            )}
          </div>
        </div>
        <hr className="met-hr" />

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
          <button
            className="random-btn btn"
            onClick={() => this.randomToggle(0)}
          >
            Turn Random Off
          </button>
        ) : (
          <button
            className="random-btn btn"
            onClick={() => this.randomToggle(1)}
          >
            Turn Random On
          </button>
        )}
        <hr className="met-hr" />

        <button id="taptempo-btn" className="btn " onClick={this.tapTempo}>
          Tap Tempo
        </button>
      </main>
    );
  }
}
const domContainer = document.querySelector("#metrnome-sidenav");
ReactDOM.render(<Metronome />, domContainer);

//Global Loop Variables
let metLoop;
let secondaryMetLoop;
let ternaryMetLoop;

//cached ball element for animation
const ballEl = document.querySelector(".met-anim-ball");

//Howler audio vars
var clave = new Howl({ src: [assetsPath + "clave.wav"] });
var clave2 = new Howl({ src: [assetsPath + "clave2.wav"] });
var clave3 = new Howl({ src: [assetsPath + "clave3.wav"] });
var clave4 = new Howl({ src: [assetsPath + "clave4.wav"] });
