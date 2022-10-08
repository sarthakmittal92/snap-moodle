import axios from "axios";
import * as actionTypes from "./actionTypes";
import { updateObject } from "../utility";

const createCourseStart = () => {
  return {
    type: actionTypes.CREATE_COURSE_START
  };
};

const createCourseSuccess = course => {
  return {
    type: actionTypes.CREATE_COURSE_SUCCESS,
    course
  };
};

const createCourseFail = error => {
  return {
    type: actionTypes.CREATE_COURSE_FAIL,
    error: error
  };
};

export const createCourse = (token, course) => {
  return dispatch => {
    dispatch(createCourseStart());
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .post(`http://127.0.0.1:8000/courses/`, course)
      .then(res => {
        dispatch(createCourseSuccess());
      })
      .catch(err => {
        dispatch(createCourseFail());
      });
  };
};

const getCourseListStart = () => {
  return {
    type: actionTypes.GET_COURSES_LIST_START
  };
};

const getCourseListSuccess = courses => {
  return {
    type: actionTypes.GET_COURSES_LIST_SUCCESS,
    courses
  };
};

const getCourseListFail = error => {
  return {
    type: actionTypes.GET_COURSES_LIST_FAIL,
    error: error
  };
};

export const getCourses = (token, username, accessCode) => {
  return dispatch => {
    dispatch(getCourseListStart());
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .get(`http://127.0.0.1:8000/courses/code/?username=${username}&accessCode=${accessCode}`)
      .then(res => {
        const courses = res.data;
        dispatch(getCourseListSuccess(courses));
      })
      .catch(err => {
        dispatch(getCourseListFail());
      });
  };
};

export const getCourseDetailStart = () => {
  return {
    type: actionTypes.GET_COURSE_DETAIL_START
  };
};

export const getCourseDetailSuccess = course => {
  return {
    type: actionTypes.GET_COURSE_DETAIL_SUCCESS,
    course
  };
};

export const getCourseDetailFail = error => {
  return {
    type: actionTypes.GET_COURSE_DETAIL_FAIL,
    error: error
  };
};

export const getCourseDetail = (token, id) => {
  return dispatch => {
    dispatch(getCourseDetailStart());
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };

    axios
      .get(`http://127.0.0.1:8000/courses/${id}`)
      .then(res => {
        const course = res.data;
        console.log(course)
        dispatch(getCourseDetailSuccess(course));
      })
      .catch(err => {
        dispatch(getCourseDetailFail());
    });

    axios
      .get(`http://127.0.0.1:8000/courses/get_permissions/${id}`)
      .then(res => {
        // console.log(res.data)
        const perm = res.data;
        // console.log('got perm')
        // console.log(perm)
        // console.log('done')
        dispatch(getPermissionsSuccess(perm));
      })
      .catch(err => {
        console.log(err)
    });
  };
};

export const getPermissionsSuccess = perm => {
  return {
    type: actionTypes.GET_PERMISSIONS_SUCCESS,
    perm
  }
}