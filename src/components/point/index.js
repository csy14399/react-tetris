import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../../actions';
import Number from '../number';
import { i18n, lan } from '../../unit/const';

const DF = i18n.point[lan];
const ZDF = i18n.highestScore[lan];
const SLDF = i18n.lastRound[lan];

class Point extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: '',
      number: 0,
    };
    this.review = this.review.bind(this);
  }
  componentWillMount() {
    this.onChange(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.onChange(nextProps);
  }
  shouldComponentUpdate({ cur, point, max }) {
    const props = this.props;
    return cur !== props.cur || point !== props.point || max !== props.max || !props.cur;
  }
  onChange({ cur, point, max }) {
    clearInterval(Point.timeout);
    if (cur) { // 在游戏进行中
      this.setState({
        label: point >= max ? ZDF : DF,
        number: point,
      });
    } else { // 游戏未开始
      this.setState({
        label: ZDF,
        number: max,
      });
    }
  }
  review() {
    this.props.dispatch(actions.setReview({ on: true, step: 0 }));
  }
  render() {
    const { cur, point } = this.props;
    if (cur) {
      return (
        <div>
          <p>{this.state.label}</p>
          <Number number={this.state.number} />
        </div>
      );
    }
    return (
      <div className="point-panel">
        <p>Game Over</p>
        <p>{SLDF}</p>
        <Number number={point} />
        <p>{ZDF}</p>
        <Number number={this.state.number} />
        <div className="buttons">
          <button onClick={this.review}>
            Review Game
          </button>
        </div>
      </div>
    );
  }
}

Point.statics = {
  timeout: null,
};

Point.propTypes = {
  cur: propTypes.bool,
  max: propTypes.number.isRequired,
  point: propTypes.number.isRequired,
  dispatch: propTypes.func.isRequired,
};

export default connect()(Point);
