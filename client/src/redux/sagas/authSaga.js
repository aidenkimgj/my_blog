import axios from 'axios';
import { all, call, put, takeEvery, fork } from 'redux-saga/effects';
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS } from '../types';

// Login User API

const loginUserAPI = loginData => {
  console.log(loginData, 'loginData');
  const config = {
    header: new Headers(),
    // headers: {
    //   'Content-Type': 'application/json',
    // },
  };
  return axios.post('api/auth', loginData, config);
};

function* loginUser(action) {
  try {
    const result = yield call(loginUserAPI, action.payload);
    console.log(result);
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
// 매번 로그인 요청을 보고 있으라는 함수
function* watchLoginUser() {
  yield takeEvery(LOGIN_REQUEST, loginUser);
}

export default function* authSaga() {
  yield all([fork(watchLoginUser)]);
}
