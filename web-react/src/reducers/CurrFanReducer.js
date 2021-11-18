import { SET_CURR_FAN } from '../actions/fanActions';

const initialState = {
  currFan: {
    thisFanName: '',
    thisFanEmail: '',
    thisFanGender: '',
  },
};

export default function currFanReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURR_FAN:
      return {
        ...state,
        currFan: action.payload,
      };
  }
}
