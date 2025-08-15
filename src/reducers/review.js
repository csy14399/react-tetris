import { fromJS } from 'immutable';
import { SET_REVIEW } from '../unit/reducerType';

const initialState = fromJS({
  on: false,
  step: 0,
});

const review = (state = initialState, action) => {
  switch (action.type) {
    case SET_REVIEW:
      return fromJS(action.data);
    default:
      return state;
  }
};

export default review;
