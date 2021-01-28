import axios from 'axios';
import { all, call, put, takeEvery, fork } from 'redux-saga/effects';
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
} from '../types';

// Login User API

const loginUserAPI = loginData => {
  console.log(loginData, 'loginData');
  const config = {
    header: new Headers(),
    // headers: {
    //   'Content-Type': 'application/json',
    // },
  };
  // 리턴 되는 장소는 call()을 부른곳이다
  return axios.post('api/auth', loginData, config);
};

function* loginUser(action) {
  console.log(action);
  try {
    // call() 함수를 동기적으로 실행 call에 넘겨진 함수가 Promise를 리턴하면 그 Promise가 resolved 될 때까지 call()을 호출한 부분에서 실행이 멈춘다
    const result = yield call(loginUserAPI, action.payload);
    console.log(result);
    // put() 액션을 dispatch 한다 보통 take로 액션을 캐치해서 api 호출을 call로 실행하고 성공/실패 여부에 따라 리덕스 store에 반영하기 위해서 호출하는 effect임
    yield put({
      type: LOGIN_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: LOGIN_FAILURE,
      payload: e.response,
    });
  }
}
// takeEvery() 캐치된 모든 액션에 대해서 핸들러를 실행한다 (매번 로그인 요청을 보고 있으라는 함수)
function* watchLoginUser() {
  yield takeEvery(LOGIN_REQUEST, loginUser);
}

// Logout User

function* logoutUser(action) {
  try {
    // put() 액션을 dispatch 한다 보통 take로 액션을 캐치해서 api 호출을 call로 실행하고 성공/실패 여부에 따라 리덕스 store에 반영하기 위해서 호출하는 effect임
    yield put({
      type: LOGOUT_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: LOGOUT_FAILURE,
    });
    console.log(e);
  }
}
// takeEvery() 캐치된 모든 액션에 대해서 핸들러를 실행한다 (매번 로그아웃 요청을 보고 있으라는 함수)
function* watchLogoutUser() {
  yield takeEvery(LOGOUT_REQUEST, logoutUser);
}

export default function* authSaga() {
  // fork() 매개변수로 전달된 함수를 비동기적으로 실행
  yield all([fork(watchLoginUser), fork(watchLogoutUser)]);
}
