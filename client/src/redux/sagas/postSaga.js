import axios from 'axios';
import {
  POST_LOADING_FAILURE,
  POST_LOADING_REQUEST,
  POST_LOADING_SUCCESS,
} from '../types';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';

// All Posts load

const loadPostAPI = postData => {
  const config = {};
  return axios.get('/api/post');
};

function* loadPosts(action) {
  try {
    const result = yield call(loadPostAPI);
    console.log(result, 'loadPosts');
    yield put({
      type: POST_LOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: POST_LOADING_FAILURE,
      payload: e.response,
    });
    // 실패하면 홈으로 화면을 전환해
    yield push('/');
  }
}

function* watchLoadPosts() {
  yield takeEvery(POST_LOADING_REQUEST, loadPosts);
}

export default function* postSaga() {
  yield all([fork(watchLoadPosts)]);
}
