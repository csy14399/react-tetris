import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import propTypes from 'prop-types';
import style from './index.less';

import Matrix from '../components/matrix';
import Decorate from '../components/decorate';
import Number from '../components/number';
import Next from '../components/next';
import Music from '../components/music';
import Pause from '../components/pause';
import Point from '../components/point';
import Logo from '../components/logo';
import Keyboard from '../components/keyboard';
import ReviewKeyboard from '../components/review_keyboard';
import Guide from '../components/guide';

import { transform, lastRecord, speeds, i18n, lan } from '../unit/const';
import { visibilityChangeEvent, isFocus, calculateHoles } from '../unit/';
import states from '../control/states';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight,
    };
  }
  componentWillMount() {
    window.addEventListener('resize', this.resize.bind(this), true);
  }
  componentDidMount() {
    if (visibilityChangeEvent) {
      document.addEventListener(visibilityChangeEvent, () => {
        states.focus(isFocus());
      }, false);
    }

    if (lastRecord) {
      if (lastRecord.cur && !lastRecord.pause) {
        const speedRun = this.props.speedRun;
        let timeout = speeds[speedRun - 1] / 2;
        timeout = speedRun < speeds[speeds.length - 1] ? speeds[speeds.length - 1] : speedRun;
        states.auto(timeout);
      }
      if (!lastRecord.cur) {
        states.overStart();
      }
    } else {
      states.overStart();
    }
  }
  resize() {
    this.setState({
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight,
    });
  }
  render() {
    let filling = 0;
    const size = (() => {
      const w = this.state.w;
      const h = this.state.h;
      const ratio = h / w;
      let scale;
      let css = {};
      if (ratio < 1.5) {
        scale = h / 960;
      } else {
        scale = w / 640;
        filling = (h - (960 * scale)) / scale / 3;
        css = {
          paddingTop: Math.floor(filling) + 42,
          paddingBottom: Math.floor(filling),
          marginTop: Math.floor(-480 - (filling * 1.5)),
        };
      }
      css[transform] = `scale(${scale})`;
      return css;
    })();

    const { review, history } = this.props;
    const isReviewMode = review.get('on');
    let screenNode;
    let keyboardNode;

    if (isReviewMode) {
      const step = review.get('step');
      const historyState = history.get(step);
      const reviewMatrix = historyState.get('matrix');
      const reviewCur = historyState.get('cur');
      const reviewPoints = historyState.get('points');
      const reviewClearLines = historyState.get('clearLines');
      const reviewSpeedRun = historyState.get('speedRun');
      const reviewNext = historyState.get('next');
      const currentHoles = calculateHoles(reviewMatrix);
      let feedback = '';
      if (step > 0) {
        const prevMatrix = history.get(step - 1).get('matrix');
        const prevHoles = calculateHoles(prevMatrix);
        const diff = currentHoles - prevHoles;
        if (diff > 0) {
          feedback = `+${diff} new holes`;
        } else if (diff < 0) {
          feedback = `${-diff} holes filled`;
        } else {
          feedback = 'No new holes';
        }
      }

      screenNode = (
        <div className={style.panel}>
          <Matrix
            matrix={reviewMatrix}
            cur={reviewCur}
            reset={false}
          />
          <div className={style.state}>
            <p>{`Reviewing Step: ${step + 1} / ${history.size}`}</p>
            <p>{i18n.cleans[lan]}</p>
            <Number number={reviewClearLines} />
            <p>{i18n.level[lan]}</p>
            <Number number={reviewSpeedRun} length={1} />
            <p>{i18n.next[lan]}</p>
            <Next data={reviewNext} />
            <p>Score</p>
            <Number number={reviewPoints} />
            <p>Holes: {currentHoles}</p>
            {feedback && <p>Feedback: {feedback}</p>}
          </div>
        </div>
      );
      keyboardNode = <ReviewKeyboard filling={filling} />;
    } else {
      screenNode = (
        <div className={style.panel}>
          <Matrix
            matrix={this.props.matrix}
            cur={this.props.cur}
            reset={this.props.reset}
          />
          <Logo cur={!!this.props.cur} reset={this.props.reset} />
          <div className={style.state}>
            <Point cur={!!this.props.cur} point={this.props.points} max={this.props.max} />
            <p>{this.props.cur ? i18n.cleans[lan] : i18n.startLine[lan]}</p>
            <Number number={this.props.cur ? this.props.clearLines : this.props.startLines} />
            <p>{i18n.level[lan]}</p>
            <Number
              number={this.props.cur ? this.props.speedRun : this.props.speedStart}
              length={1}
            />
            <p>{i18n.next[lan]}</p>
            <Next data={this.props.next} />
            <div className={style.bottom}>
              <Music data={this.props.music} />
              <Pause data={this.props.pause} />
              <Number time />
            </div>
          </div>
        </div>
      );
      keyboardNode = <Keyboard filling={filling} keyboard={this.props.keyboard} />;
    }

    return (
      <div
        className={style.app}
        style={size}
      >
        <div className={classnames({ [style.rect]: true, [style.drop]: this.props.drop })}>
          <Decorate />
          <div className={style.screen}>
            {screenNode}
          </div>
        </div>
        {keyboardNode}
        <Guide />
      </div>
    );
  }
}

App.propTypes = {
  music: propTypes.bool.isRequired,
  pause: propTypes.bool.isRequired,
  matrix: propTypes.object.isRequired,
  next: propTypes.string.isRequired,
  cur: propTypes.object,
  dispatch: propTypes.func.isRequired,
  speedStart: propTypes.number.isRequired,
  speedRun: propTypes.number.isRequired,
  startLines: propTypes.number.isRequired,
  clearLines: propTypes.number.isRequired,
  points: propTypes.number.isRequired,
  max: propTypes.number.isRequired,
  reset: propTypes.bool.isRequired,
  drop: propTypes.bool.isRequired,
  keyboard: propTypes.object.isRequired,
  review: propTypes.object.isRequired,
  history: propTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  music: state.get('music'),
  pause: state.get('pause'),
  matrix: state.get('matrix'),
  next: state.get('next'),
  cur: state.get('cur'),
  speedStart: state.get('speedStart'),
  speedRun: state.get('speedRun'),
  startLines: state.get('startLines'),
  clearLines: state.get('clearLines'),
  points: state.get('points'),
  max: state.get('max'),
  reset: state.get('reset'),
  drop: state.get('drop'),
  keyboard: state.get('keyboard'),
  review: state.get('review'),
  history: state.get('history'),
});

export default connect(mapStateToProps)(App);
