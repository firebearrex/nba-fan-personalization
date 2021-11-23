import { useDispatch } from 'react-redux';

export const SET_CURR_FAN = 'SET_CURR_FAN';

const setFan = (currFan) => {
  const dispatch = useDispatch();
  dispatch({
    type: SET_CURR_FAN,
    payload: currFan,
  });
};

const fanActions = {
  setFan,
};

export default fanActions;
