import axios from 'axios';
import {
  CATEGORY_FIND_FAILURE,
  CATEGORY_FIND_REQUEST,
  CATEGORY_FIND_SUCCESS,
  POST_DELETE_FAILURE,
  POST_DELETE_REQUEST,
  POST_DELETE_SUCCESS,
  POST_DETAIL_LOADING_FAILURE,
  POST_DETAIL_LOADING_REQUEST,
  POST_DETAIL_LOADING_SUCCESS,
  POST_EDIT_LOADING_FAILURE,
  POST_EDIT_LOADING_REQUEST,
  POST_EDIT_LOADING_SUCCESS,
  POST_EDIT_UPLOADING_FAILURE,
  POST_EDIT_UPLOADING_REQUEST,
  POST_EDIT_UPLOADING_SUCCESS,
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

// Post Delete
const DeletePostAPI = payload => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const token = payload.token;

  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return axios.delete(`/api/post/${payload.id}`, config);
};

function* DeletePost(action) {
  console.log('delete', action);
  try {
    const result = yield call(DeletePostAPI, action.payload);
    yield put({
      type: POST_DELETE_SUCCESS,
      payload: result.data,
    });
    yield put(push('/'));
  } catch (e) {
    yield put({
      type: POST_DELETE_FAILURE,
      payload: e,
    });
  }
}

function* watchDeletePost() {
  yield takeEvery(POST_DELETE_REQUEST, DeletePost);
}

// Post Edit Load
const PostEditLoadAPI = payload => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const token = payload.token;

  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return axios.get(`/api/post/${payload.id}/edit`, config);
};

function* PostEditLoad(action) {
  try {
    const result = yield call(PostEditLoadAPI, action.payload);
    yield put({
      type: POST_EDIT_LOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: POST_EDIT_LOADING_FAILURE,
      payload: e,
    });
    yield put(push('/'));
  }
}

function* watchPostEditLoad() {
  yield takeEvery(POST_EDIT_LOADING_REQUEST, PostEditLoad);
}

// Post Edit UpLoad
const PostEditUploadAPI = payload => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const token = payload.token;

  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return axios.post(`/api/post/${payload.id}/edit`, payload, config);
};

function* PostEditUpload(action) {
  try {
    const result = yield call(PostEditUploadAPI, action.payload);
    yield put({
      type: POST_EDIT_UPLOADING_SUCCESS,
      payload: result.data,
    });
    yield put(push(`/post/${result.data._id}`));
  } catch (e) {
    yield put({
      type: POST_EDIT_UPLOADING_FAILURE,
      payload: e,
    });
  }
}

function* watchPostEditUpload() {
  yield takeEvery(POST_EDIT_UPLOADING_REQUEST, PostEditUpload);
}

// Category Find
const CategoryFindAPI = payload => {
  // encodeURIComponent() 함수는 URI의 특정한 문자를 UTF-8로 인코딩해 하나, 둘 셋, 혹은 네 개의 연속된 이스케이프 문자로 나타낸다(두 개의 대리 문자로 이루어진 문자만 이스케이프 문자 네 개로 변환 됨)
  return axios.get(`/api/post/category/${encodeURIComponent(payload)}`);
};

function* CategoryFind(action) {
  try {
    const result = yield call(CategoryFindAPI, action.payload);
    yield put({
      type: CATEGORY_FIND_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: CATEGORY_FIND_FAILURE,
      payload: e,
    });
  }
}

function* watchCategoryFind() {
  yield takeEvery(CATEGORY_FIND_REQUEST, CategoryFind);
}

export default function* postSaga() {
  yield all([
    fork(watchLoadPosts),
    fork(watchUploadPosts),
    fork(watchLoadPostDetail),
    fork(watchDeletePost),
    fork(watchPostEditLoad),
    fork(watchPostEditUpload),
    fork(watchCategoryFind),
  ]);
}
