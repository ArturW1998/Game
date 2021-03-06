import React, { Component } from 'react';

import { random, clone } from '../../utils/helpers';

import { Display } from '../../components/Display';

import { Target } from '../Target';
import { TopNumber } from '../TopNumber';

import './css/App.css';

const width = window.innerWidth < 450 ? 150 : 250;

const fieldStyle = {
  position: 'absolute',
  width,
  bottom: 60,
  left: 10,
  height: '60%'
};

class App extends Component {
  state = {
    game: false,
    targets: {},
    latestClick: 0
  };

  intervals = null;

  componentDidUpdate(prevProps, { latestClick }) {
    const { latestClick: stateLatestClick } = this.state;

    if (stateLatestClick < latestClick) {
      this.endGame();
    }
  }

  createTarget = (key, ms) => {
    ms = ms || random(500, 2000);

    this.intervals.push(
      setInterval(() => {
        const { targets: stateTargets } = this.state;
        const targets = clone(stateTargets);
        const num = random(1, 1000 * 1000);
        targets[key] = targets[key] !== 0 ? 0 : num;
        this.setState({ targets });
      }, ms)
    );
  };

  hitTarget = ({ target: { className, innerText } }) => {
    if (className !== 'target') return;
    const num = parseInt(innerText);
    const { targets } = this.state;

    /* eslint-disable no-unused-vars */
    for (const target in targets) {
      const key = Math.random().toFixed(4);
      this.createTarget(key);
    }
    /* eslint-enable */

    this.setState({ latestClick: num });
  };

  startGame = () => {
    this.createTarget('first', 750);
    this.setState({
      game: true
    });
  };

  endGame = () => {
    this.intervals.forEach(int => {
      clearInterval(int);
    });
    this.intervals = [];
    this.setState({
      game: false,
      targets: {},
      latestClick: 0
    });
  };

  UNSAFE_componentWillMount() {
    this.intervals = [];
  }

  render() {
    const { game, latestClick, targets } = this.state;
    const buttonStyle = {
      display: game ? 'none' : 'inline-block'
    };
    const targetItems = [];
    for (const key in targets) {
      targetItems.push(<Target number={targets[key]} key={key} />);
    }

    return (
      <div>
        <TopNumber number={latestClick} game={game} />
        <Display number={latestClick} />
        <button onClick={this.startGame} style={buttonStyle}>
          New Game
        </button>
        <div style={fieldStyle} onClick={this.hitTarget}>
          {targetItems}
        </div>
      </div>
    );
  }
}

export default App;
