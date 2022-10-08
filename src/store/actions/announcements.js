import axios from "axios";
import * as actionTypes from "./actionTypes";
import * as course_actions from "./courses";

const getAnncListStart = () => {
    return {
        type: actionTypes.GET_ANNOUNCEMENT_LIST_START
    };
};

const getAnncListSuccess = announcements => {
    return {
        type: actionTypes.GET_ANNOUNCEMENTS_LIST_SUCCESS,
        announcements
    };
};

const getAnncListFail = error => {
    return {
        type: actionTypes.GET_ANNOUNCEMENTS_LIST_FAIL,
        error: error
    };
};

export const getAnncs = (token, username, course) => {
    return dispatch => {
        dispatch(getAnncListStart());

        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        };

        axios
            .get(`http://127.0.0.1:8000/announcements/?course=${course}`)
            .then(res => {
                const announcements = res.data;
                dispatch(getAnncListSuccess(announcements));
            })
            .catch(err => {
                dispatch(getAnncListFail());
            });
    };
};

const getAnncDetailStart = () => {
    return {
        type: actionTypes.GET_ANNOUNCEMENT_DETAIL_START
    };
};

const getAnncDetailSuccess = announcement => {
    return {
        type: actionTypes.GET_ANNOUNCEMENT_DETAIL_SUCCESS,
        announcement
    };
};

const getAnncDetailFail = error => {
    return {
        type: actionTypes.GET_ANNOUNCEMENT_DETAIL_FAIL,
        error: error
    };
};

export const getAnncDetail = (token, id) => {
    return dispatch => {
        dispatch(getAnncDetailStart());
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        };
        axios
            .get(`http://127.0.0.1:8000/announcements/${id}/`)
            .then(res => {
                const announcement = res.data;
                // console.log(announcement);
                dispatch(getAnncDetailSuccess(announcement));
            })
            .catch(err => {
                dispatch(getAnncDetailFail());
            });
    };
};

const createAnncStart = () => {
    return {
        type: actionTypes.CREATE_ANNOUNCEMENT_START
    };
};

const createAnncSuccess = announcement => {
    return {
        type: actionTypes.CREATE_ANNOUNCEMENT_SUCCESS,
        announcement
    };
};

const createAnncFail = error => {
    return {
        type: actionTypes.CREATE_ANNOUNCEMENT_FAIL,
        error: error
    };
};

export const createAnnc = (token, annc) => {
    return dispatch => {
        console.log("This announcement object was received to be created ", annc);
        dispatch(createAnncStart());
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        };
        axios
            .post(`http://127.0.0.1:8000/announcements/`, annc)
            .then(res => {

                axios.defaults.headers = {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`
                };

                axios
                    .get(`http://127.0.0.1:8000/announcements/?course=${annc.course}`)
                    .then(res => {
                        const announcements = res.data;
                        dispatch(getAnncListSuccess(announcements));
                    })
                    .catch(err => {
                        dispatch(getAnncListFail());
                    });

                axios
                  .get(`http://127.0.0.1:8000/courses/${annc.course}`)
                  .then(res => {
                    const course = res.data;
                    console.log(course)
                    dispatch(course_actions.getCourseDetailSuccess(course));
                  })
                  .catch(err => {
                    dispatch(course_actions.getCourseDetailFail());
                });

                axios
                  .get(`http://127.0.0.1:8000/courses/get_permissions/${annc.course}`)
                  .then(res => {
                    // console.log(res.data)
                    const perm = res.data;
                    // console.log('got perm')
                    // console.log(perm)
                    // console.log('done')
                    dispatch(course_actions.getPermissionsSuccess(perm));
                  })
                  .catch(err => {
                    console.log(err)
                });



                dispatch(createAnncSuccess());
            })
            .catch(err => {
                dispatch(createAnncFail());
            });
    };
};