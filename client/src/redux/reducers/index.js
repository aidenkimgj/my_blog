import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import authReducer from './authReducer';
import postReducer from './postReducer';
import commentReducer from './commentReducer';

const createRootreducer = history =>
  combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    post: postReducer,
    comment: commentReducer,
  });

export default createRootreducer;
