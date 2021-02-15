import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

import createRootReducer from './redux/reducers/index.js';
import rootSaga from './redux/sagas/index.js';
// History object return
export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

const initialState = {};
// 차후에 다른 미들웨어를 사용할시 배열에 하나씩 추가해 주면 된다.
const middlewares = [sagaMiddleware, routerMiddleware(history)];
const devtools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const composeEnhancer =
  // 배포환경일때 devtools를 안보이게 하기 위해서
  process.env.NODE_ENV === 'production' ? compose : devtools || compose;

const store = createStore(
  createRootReducer(history),
  // 웹의 모든 상태를 담고 있는 초기값
  initialState,
  composeEnhancer(applyMiddleware(...middlewares))
);
// 사가미들웨어를 rootSaga로 작동하게 해달라는 의미
sagaMiddleware.run(rootSaga);

export default store;
