import { fromJS } from 'immutable';
import { ADD_HISTORY, RESET_HISTORY } from '../unit/reducerType';

const initialState = fromJS([]);

const history = (state = initialState, action) => {
  switch (action.type) {
    case ADD_HISTORY:
      return state.push(fromJS(action.data));
    case RESET_HISTORY:
      return fromJS([]);
    default:
      return state;
  }
};

export default history;
