import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  courses: [],
  codes: [],
  currentCourse: {},
  error: null,
  loading: false,
  assignments: [],
  permission: {}
};

const getCourseListStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const getCourseListSuccess = (state, action) => {
  return updateObject(state, {
    courses: action.courses,
    error: null,
    loading: false
  });
};

const getCourseListFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const getCourseDetailStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const getCourseDetailSuccess = (state, action) => {
  return updateObject(state, {
    currentCourse: action.course,
    error: null,
    loading: false
  });
};

const getCourseDetailFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const createCourseStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const createCourseSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false
  });
};

const createCourseFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const getPermissionsSuccess = (state, action) => {
  console.log("in getpermission (courses.js in action")
  console.log(action.perm)
  return updateObject(state, {
    permission: action.perm
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_COURSES_LIST_START:
      return getCourseListStart(state, action);
    case actionTypes.GET_COURSES_LIST_SUCCESS:
      return getCourseListSuccess(state, action);
    case actionTypes.GET_COURSES_LIST_FAIL:
      return getCourseListFail(state, action);
    case actionTypes.GET_COURSE_DETAIL_START:
      return getCourseDetailStart(state, action);
    case actionTypes.GET_COURSE_DETAIL_SUCCESS:
      return getCourseDetailSuccess(state, action);
    case actionTypes.GET_COURSE_DETAIL_FAIL:
      return getCourseDetailFail(state, action);
    case actionTypes.CREATE_COURSE_START:
      return createCourseStart(state, action);
    case actionTypes.CREATE_COURSE_SUCCESS:
      return createCourseSuccess(state, action);
    case actionTypes.CREATE_COURSE_FAIL:
      return createCourseFail(state, action);
    case actionTypes.GET_PERMISSIONS_SUCCESS:
      return getPermissionsSuccess(state, action);
    default:
      return state;
  }
};

export default reducer;
