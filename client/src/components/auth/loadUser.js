import { USER_LOADING_REQUEST } from '../../redux/types.js';
import store from '../../store.js';

const loadUser = () => {
  try {
    store.dispatch({
      type: USER_LOADING_REQUEST,
      payload: localStorage.getItem('token'),
    });
  } catch (e) {
    console.error(e);
  }
};

export default loadUser;
