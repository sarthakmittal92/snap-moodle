import axios from "axios";
import * as actionTypes from "./actionTypes";

const getGRADESListStart = () => {
  return {
    type: actionTypes.GET_GRADES_LIST_START
  };
};

const getGRADESListSuccess = grades => {
  return {
    type: actionTypes.GET_GRADES_LIST_SUCCESS,
    grades
  };
};

const getGRADESListFail = error => {
  return {
    type: actionTypes.GET_GRADES_LIST_FAIL,
    error: error
  };
};

export const getGRADES = (token, username, course) => {
  return dispatch => {
    dispatch(getGRADESListStart());
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .get(`http://127.0.0.1:8000/grades/?username=${username}&course=${course}`)
      .then(res => {
        const grades = res.data;

        dispatch(getGRADESListSuccess(grades));
      })
      .catch(err => {
        dispatch(getGRADESListFail());
      });
  };
};

const getCourseStatsStart = () => {
  return {
    type: actionTypes.GET_COURSE_STATS_START
  };
};

const getCourseStatsSuccess = stats => {
  return {
    type: actionTypes.GET_COURSE_STATS_SUCCESS,
    stats
  };
};

const getCourseStatsFail = error => {
  return {
    type: actionTypes.GET_COURSE_STATS_FAIL,
    error: error
  };
};

export const getCourseStats = (token, course_id) => {
  return dispatch => {
    dispatch(getCourseStatsStart());
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .get(`http://127.0.0.1:8000/grades/stats/${course_id}`)
      .then(res => {
        const stats = res.data;
        dispatch(getCourseStatsSuccess(stats));
      })
      .catch(err => {
        dispatch(getCourseStatsFail());
      });
  };
};

const getAssignmentStatsStart = () => {
  return {
    type: actionTypes.GET_ASSIGNMENT_STATS_START
  };
};

const getAssignmentStatsSuccess = stats => {
  return {
    type: actionTypes.GET_ASSIGNMENT_STATS_SUCCESS,
    stats
  };
};

const getAssignmentStatsFail = error => {
  return {
    type: actionTypes.GET_ASSIGNMENT_STATS_FAIL,
    error: error
  };
};

export const getAssignmentStats = (token, course_id, assignment_id) => {
  return dispatch => {
    dispatch(getAssignmentStatsStart());
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };

    axios
      .get(`http://127.0.0.1:8000/grades/stats/${course_id}/${assignment_id}`)
      .then(res => {
        const stats = res.data;
        console.log(stats);
        dispatch(getAssignmentStatsSuccess(stats));
      })
      .catch(err => {
        dispatch(getAssignmentStatsFail());
      });
  };
};