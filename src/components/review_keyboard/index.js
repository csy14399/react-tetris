import React from 'react';
import Immutable from 'immutable';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../../actions';
import style from '../keyboard/index.less'; // Reuse the same style
import Button from '../button';

class ReviewKeyboard extends React.Component {
  constructor(props) {
    super(props);
    this.prevStep = this.prevStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.exitReview = this.exitReview.bind(this);
  }

  shouldComponentUpdate({ review }) {
    return !Immutable.is(review, this.props.review);
  }

  prevStep() {
    const { review, dispatch } = this.props;
    const step = review.get('step');
    if (step > 0) {
      dispatch(actions.setReview({ on: true, step: step - 1 }));
    }
  }

  nextStep() {
    const { review, history, dispatch } = this.props;
    const step = review.get('step');
    if (step < history.size - 1) {
      dispatch(actions.setReview({ on: true, step: step + 1 }));
    }
  }

  exitReview() {
    this.props.dispatch(actions.setReview({ on: false, step: 0 }));
    // After exiting, we might want to trigger a game restart,
    // which is the default behavior when the game is over.
    // For now, just exiting review mode is enough.
  }

  render() {
    return (
      <div
        className={style.keyboard}
        style={{
          marginTop: 20 + this.props.filling,
        }}
      >
        <Button
          color="blue"
          size="s1"
          top={90}
          left={284}
          label="Prev"
          onClick={this.prevStep}
        />
        <Button
          color="blue"
          size="s1"
          top={90}
          left={464}
          label="Next"
          onClick={this.nextStep}
        />
        <Button
          color="red"
          size="s2"
          top={0}
          left={106}
          label="Exit Review"
          onClick={this.exitReview}
        />
      </div>
    );
  }
}

ReviewKeyboard.propTypes = {
  filling: propTypes.number.isRequired,
  review: propTypes.object.isRequired,
  history: propTypes.object.isRequired,
  dispatch: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  review: state.get('review'),
  history: state.get('history'),
});

export default connect(mapStateToProps)(ReviewKeyboard);
