import axios from "axios";
import * as actionTypes from "./actionTypes";
import * as actions from "./courses";

export const insertTA = (token, TA) => {
    return dispatch => {
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        };

        const { teacher, username, course } = TA;

        axios.defaults.headers = {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`
        };

        axios
          .get(`http://127.0.0.1:8000/courses/${course.id}`)
          .then(res => {
            const course = res.data;
            console.log(course)
            dispatch(actions.getCourseDetailSuccess(course));
          })
          .catch(err => {
            dispatch(actions.getCourseDetailFail());
        });

        axios
          .get(`http://127.0.0.1:8000/courses/get_permissions/${course.id}`)
          .then(res => {
            const perm = res.data;
            dispatch(actions.getPermissionsSuccess(perm));
          })
          .catch(err => {
            console.log(err)
        });

        const ta = JSON.stringify({
            course,
            student: username,
        })

        console.log(ta);

        axios
            .post(`http://127.0.0.1:8000/users/teachassists/`, ta)
            .then(res => {
                console.log("The output is ", res);
            })
            .catch(err => {
                console.log(err);
            });
    }
};

export const updatePermissions = (token, update_data) => {
    return dispatch => {
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        };

        const { teacher, course, permissions } = update_data;

        const permission_data = JSON.stringify({
            course,
            permissions
        })
        console.log(permission_data)
        console.log("axios starts")
        // http://127.0.0.1:8000/courses/code/
        axios
            .put(`http://127.0.0.1:8000/courses/update_permissions/${update_data.course.id}`, update_data)
            .then(res => {
                // console.log(res.data)
                const perm = res.data;
                // console.log('got perm')
                // console.log(perm)
                // console.log('done')


            })
            .catch(err => {
                console.log(err)
            });
    }
};