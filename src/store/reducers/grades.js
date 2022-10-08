import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  grades: [],
  currentGrade: {},
  stats: null,
  error: null,
  loading: false
};

const getGRADEListStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const getGRADEListSuccess = (state, action) => {
  return updateObject(state, {
    grades: action.grades,
    error: null,
    loading: false
  });
};

const getGRADEListFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const getCourseStatsStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const getCourseStatsSuccess = (state, action) => {
  return updateObject(state, {
    stats: action.stats,
    error: null,
    loading: false
  });
};

const getCourseStatsFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const getAssignmentStatsStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const getAssignmentStatsSuccess = (state, action) => {
  return updateObject(state, {
    stats: action.stats,
    error: null,
    loading: false
  });
};

const getAssignmentStatsFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_GRADES_LIST_START:
      return getGRADEListStart(state, action);
    case actionTypes.GET_GRADES_LIST_SUCCESS:
      return getGRADEListSuccess(state, action);
    case actionTypes.GET_GRADES_LIST_FAIL:
      return getGRADEListFail(state, action);
    case actionTypes.GET_COURSE_STATS_START:
      return getCourseStatsStart(state, action);
    case actionTypes.GET_COURSE_STATS_SUCCESS:
      return getCourseStatsSuccess(state, action);
    case actionTypes.GET_COURSE_STATS_FAIL:
      return getCourseStatsFail(state, action);
    case actionTypes.GET_ASSIGNMENT_STATS_START:
      return getAssignmentStatsStart(state, action);
    case actionTypes.GET_ASSIGNMENT_STATS_SUCCESS:
      return getAssignmentStatsSuccess(state, action);
    case actionTypes.GET_ASSIGNMENT_STATS_FAIL:
      return getAssignmentStatsFail(state, action);
    default:
      return state;
  }
};

export default reducer;
