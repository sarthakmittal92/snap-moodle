import axios from "axios";
import * as actionTypes from "./actionTypes";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = user => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    user
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const logout = () => {
  localStorage.removeItem("user");
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const checkTAStatus = boolean => {
  return {
    type: actionTypes.GET_TA_CHECK,
    check: boolean
  }
}

export const authLogin = (username, password) => {
  return dispatch => {
    dispatch(authStart());
    axios
      .post("http://127.0.0.1:8000/rest-auth/login/", {
        username: username,
        password: password
      })
      .then(res => {
        const user = {
          token: res.data.key,
          username,
          userId: res.data.user,
          is_student: res.data.user_type.is_student,
          is_teacher: res.data.user_type.is_teacher,
          expirationDate: new Date(new Date().getTime() + 3600 * 1000)
        };

        axios.defaults.headers = {
          "Content-Type": "application/json",
          Authorization: `Token ${user.token}`
        };

        axios.get(`http://127.0.0.1:8000/users/${user.userId}`)
        .then(res2 => {
            const user2 = {
            token: res.data.key,
            username,
            email: res2.data.email,
            userId: res.data.user,
            is_student: res.data.user_type.is_student,
            is_teacher: res.data.user_type.is_teacher,
            expirationDate: new Date(new Date().getTime() + 3600 * 1000)
          };
          localStorage.setItem("user", JSON.stringify(user2));

          dispatch(authSuccess(user2));
        })
        .catch(err => {
          console.log(err);
        })
        dispatch(checkAuthTimeout(3600));
      })
      .catch(err => {
        dispatch(authFail(err));
      });
  };
};

export const authSignup = (
  username,
  email,
  password1,
  password2,
  is_student
) => {
  return dispatch => {
    dispatch(authStart());
    const user = {
      username,
      email,
      password1,
      password2,
      is_student,
      is_teacher: !is_student
    };
    axios
      .post("http://127.0.0.1:8000/rest-auth/registration/", user)
      .then(res => {
        const user = {
          token: res.data.key,
          username,
          email,
          userId: res.data.user,
          is_student,
          is_teacher: !is_student,
          expirationDate: new Date(new Date().getTime() + 3600 * 1000)
        };
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(authSuccess(user));
        dispatch(checkAuthTimeout(3600));
      })
      .catch(err => {
        dispatch(authFail(err));
      });
  };
};

export const authCheckState = () => {
  return dispatch => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user === undefined || user === null) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(user.expirationDate);
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(user));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};

export const checkTA = (token, courseId, username) => {
  return dispatch => {
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .get(`http://127.0.0.1:8000/users/checkta/${courseId}/${username}`)
      .then(res => {
        // localStorage.setItem("tacheck2", res.data)
        console.log("auth.js line 142")
        console.log(res.data)
        dispatch(checkTAStatus(res.data))
      })
      .catch(err => {
        console.log(err)
      });
  };
};

export const generateOTPmail = (OTP) => {
  return {
    type: actionTypes.GENERATE_OTP_MAIL,
    otp: OTP
  }
}

export const generateOTP = (token, username) => {
  return dispatch => {
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .get(`http://127.0.0.1:8000/users/generateOTP/${username}`)
      .then(res => {
        // localStorage.setItem("tacheck2", res.data)
        console.log("otp", res.data)
        dispatch(generateOTPmail(res.data))
      })
      .catch(err => {
        console.log(err)
      });
  };
};