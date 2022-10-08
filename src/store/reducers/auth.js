import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  token: null,
  username: null,
  is_student: null,
  is_teacher: null,
  is_ta: null,
  userId: null,
  error: null,
  email: null,
  loading: false,
  feedback: null,
  otp: null,
};

const checkTA = (state, action) => {

}

const authStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const authSuccess = (state, action) => {
  console.log("user email ", action.user.email);
  return updateObject(state, {
    token: action.user.token,
    username: action.user.username,
    email: action.user.email,
    is_student: action.user.is_student,
    is_teacher: action.user.is_teacher,
    userId: action.user.userId,
    error: null,
    loading: false
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const authLogout = (state, action) => {
  return updateObject(state, {
    token: null
  });
};

const update_ta_state = (state, action) => {
  console.log("update_ta_state")
  console.log(action.check)
  return updateObject(state, {
    is_ta: action.check
  })
}

const update_otp = (state, action) => {
  return updateObject(state, {
    otp: action.otp
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    case actionTypes.GET_TA_CHECK:
      return update_ta_state(state, action);
    case actionTypes.GENERATE_OTP_MAIL:
      return update_otp(state, action);
    default:
      return state;
  }
};

export default reducer;
