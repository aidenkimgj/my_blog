import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

const createRootreducer = history =>
  combineReducers({
    router: connectRouter(history),
  });

export default createRootreducer;
