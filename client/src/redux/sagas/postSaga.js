import axios from 'axios';
import {
  POST_DETAIL_LOADING_FAILURE,
  POST_DETAIL_LOADING_REQUEST,
  POST_DETAIL_LOADING_SUCCESS,
  POST_LOADING_FAILURE,
  POST_LOADING_REQUEST,
  POST_LOADING_SUCCESS,
  POST_UPLOADING_FAILURE,
  POST_UPLOADING_REQUEST,
  POST_UPLOADING_SUCCESS,
} from '../types';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';

// All Posts load

const loadPostAPI = postData => {
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
    yield put(push('/'));
  }
}

function* watchLoadPosts() {
  yield takeEvery(POST_LOADING_REQUEST, loadPosts);
}

// Post upload

const uploadPostAPI = payload => {
  console.log(payload, '넘어온 payload');
  const config = {
    headers: new Headers(),
  };

  const token = payload.token;

  if (token) {
    config.headers['x-auth-token'] = token;
  }
  console.log(config);
  const result = axios.post('/api/post', payload, config);
  console.log(result);
  return result;
};

function* uploadPosts(action) {
  try {
    console.log(action, 'uploadPost function');
    const result = yield call(uploadPostAPI, action.payload);
    console.log(result, 'uploadPostAPI, action.payload');
    yield put({
      type: POST_UPLOADING_SUCCESS,
      payload: result.data,
    });
    // 업로딩이 성공을 하면 프론트에 로딩이 성공한 페이지로 넘어가게 해 준다.
    yield put(push(`/post/${result.data._id}`));
  } catch (e) {
    yield put({
      type: POST_UPLOADING_FAILURE,
      payload: e,
    });
    yield put(push('/'));
  }
}

function* watchUploadPosts() {
  yield takeEvery(POST_UPLOADING_REQUEST, uploadPosts);
}

// Post Detail

const loadPostDetailAPI = payload => {
  console.log(payload, '넘어온 payload');
  const result = axios.get(`/api/post/${payload}`);
  console.log(result);
  return result;
};

function* loadPostDetail(action) {
  try {
    const result = yield call(loadPostDetailAPI, action.payload);
    console.log(result, 'loadPostDetailAPI, action.payload');
    yield put({
      type: POST_DETAIL_LOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: POST_DETAIL_LOADING_FAILURE,
      payload: e,
    });
    yield put(push('/'));
  }
}

function* watchLoadPostDetail() {
  yield takeEvery(POST_DETAIL_LOADING_REQUEST, loadPostDetail);
}

export default function* postSaga() {
  yield all([
    fork(watchLoadPosts),
    fork(watchUploadPosts),
    fork(watchLoadPostDetail),
  ]);
}
