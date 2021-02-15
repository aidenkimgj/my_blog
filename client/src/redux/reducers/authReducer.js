import {
  CLEAR_ERROR_FAILURE,
  CLEAR_ERROR_REQUEST,
  CLEAR_ERROR_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  PASSWORD_EDIT_UPLOADING_FAILURE,
  PASSWORD_EDIT_UPLOADING_REQUEST,
  PASSWORD_EDIT_UPLOADING_SUCCESS,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  USER_LOADING_FAILURE,
  USER_LOADING_REQUEST,
  USER_LOADING_SUCCESS,
} from '../types.js';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  user: '',
  userId: '',
  userName: '',
  userRole: '',
  errorMsg: '',
  successMsg: '',
  previousMatchMsg: '',
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGOUT_REQUEST:
    case LOGIN_REQUEST:
      return {
        ...state,
        errorMsg: '',
        isLoading: true,
      };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        userId: action.payload.user.id,
        userRole: action.payload.user.role,
        errorMsg: '',
      };

    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case LOGOUT_FAILURE:
      localStorage.removeItem('token');
      return {
        ...state,
        ...action.payload,
        isAuthenticated: false,
        isLoading: false,
        user: '',
        userId: '',
        userRole: '',
        token: '',
        errorMsg: action.payload.data.msg,
      };

    case LOGOUT_SUCCESS:
      localStorage.removeItem('token');
      return {
        token: '',
        user: '',
        isAuthenticated: '',
        isLoading: false,
        userId: '',
        userRole: '',
        errorMsg: '',
      };

    case USER_LOADING_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case USER_LOADING_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
        userId: action.payload._id,
        userName: action.payload.name,
        userRole: action.payload.role,
      };

    case USER_LOADING_FAILURE:
      return {
        ...state,
        user: '',
        isAuthenticated: false,
        isLoading: false,
        userRole: '',
      };

    case PASSWORD_EDIT_UPLOADING_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case PASSWORD_EDIT_UPLOADING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        successMsg: action.payload.data.success_msg,
        errorMsg: '',
        previousMsg: '',
      };

    case PASSWORD_EDIT_UPLOADING_FAILURE:
      return {
        ...state,
        isLoading: false,
        successMsg: '',
        errorMsg: action.payload.data.fail_msg,
        previousMatchMsg: action.payload.data.match_msg,
      };

    case CLEAR_ERROR_REQUEST:
      return {
        ...state,
        errorMsg: '',
      };

    case CLEAR_ERROR_SUCCESS:
      return {
        ...state,
        errorMsg: '',
        previousMatchMsg: '',
        successMsg: '',
      };

    case CLEAR_ERROR_FAILURE:
      return {
        ...state,
        errorMsg: 'Clear Error Fail',
        previousMatchMsg: 'Clear Error Fail',
      };

    default:
      return state;
  }
};

export default authReducer;
