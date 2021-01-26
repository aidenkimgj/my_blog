import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import authSaga from './authSaga';
import dotenv from 'dotenv';
dotenv.config();

axios.defaults.baseURL = process.env.REACT_APP_BASIC_SERVER_URL;

// generator 함수 여러값을 반환하게 해주는 함수 형태
export default function* rootSaga() {
  // 배열안에 여러가지 사가스 관련된 값을 불러서 사용할 수 있게 해줌
  yield all([fork(authSaga)]);
}
