import axios from "axios";
import * as actionTypes from "./actionTypes";

const getASNTListStart = () => {
  return {
    type: actionTypes.GET_ASSIGNMENT_LIST_START
  };
};

const getASNTListSuccess = assignments => {
  return {
    type: actionTypes.GET_ASSIGNMENTS_LIST_SUCCESS,
    assignments
  };
};

const getASNTListFail = error => {
  return {
    type: actionTypes.GET_ASSIGNMENTS_LIST_FAIL,
    error: error
  };
};

export const getASNTS = (token, username, course) => {
  return dispatch => {
    dispatch(getASNTListStart());
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      // .get(`http://127.0.0.1:8000/courses/${course}/`)
      .get(`http://127.0.0.1:8000/assignments/?course=${course}`)
      .then(res => {
        const assignments = res.data;
        dispatch(getASNTListSuccess(assignments));
      })
      .catch(err => {
        dispatch(getASNTListFail());
      });
  };
};

const getASNTDetailStart = () => {
  return {
    type: actionTypes.GET_ASSIGNMENT_DETAIL_START
  };
};

const getASNTDetailSuccess = assignment => {
  return {
    type: actionTypes.GET_ASSIGNMENT_DETAIL_SUCCESS,
    assignment
  };
};

const getASNTDetailFail = error => {
  return {
    type: actionTypes.GET_ASSIGNMENT_DETAIL_FAIL,
    error: error
  };
};

const getFeedbackStart = () => {
  return {
    type: actionTypes.GET_FEEDBACK_START
  };
};

const getFeedbackSuccess = feedbackInfo => {
  return {
    type: actionTypes.GET_FEEDBACK_SUCCESS,
    feedbackInfo
  };
};

const getFeedbackFail = error => {
  return {
    type: actionTypes.GET_FEEDBACK_FAIL,
    error: error
  };
};

export const getASNTSDetail = (token, id) => {
  // Actually this should by getASNTDetail
  return dispatch => {
    dispatch(getASNTDetailStart());
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .get(`http://127.0.0.1:8000/assignments/${id}`)
      .then(res => {
        const assignment = res.data;
        // console.log(assignment);
        dispatch(getASNTDetailSuccess(assignment));
      })
      .catch(err => {
        dispatch(getASNTDetailFail());
      });
  };
};

const createASNTStart = () => {
  return {
    type: actionTypes.CREATE_ASSIGNMENT_START
  };
};

const createASNTSuccess = assignment => {
  return {
    type: actionTypes.CREATE_ASSIGNMENT_SUCCESS,
    // assignment
  };
};

const createASNTFail = error => {
  return {
    type: actionTypes.CREATE_ASSIGNMENT_FAIL,
    error: error
  };
};

export const createASNT = (token, asnt) => {
  return dispatch => {
    console.log(asnt)
    dispatch(createASNTStart());
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .post(`http://127.0.0.1:8000/assignments/`, asnt)
      .then(res => {
        const out_asnt = res.data;

        dispatch(getASNTListStart());
        axios.defaults.headers = {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`
        };

        axios
          .get(`http://127.0.0.1:8000/assignments/?course=${asnt.course.id}`)
          .then(res => {
            const assignments = res.data;
            dispatch(getASNTListSuccess(assignments));
          })
          .catch(err => {
            dispatch(getASNTListFail());
          });

        console.log("This came back from post the database ", out_asnt);
        dispatch(createASNTSuccess());
      })
      .catch(err => {
        dispatch(createASNTFail());
      });
  };
};
var fileDownload = require('js-file-download');

export const handlePDFDownload = (course_id, username, title) => {
  axios.get(`http://127.0.0.1:8000/assignments/download/${course_id}/${title}/${username}`, {
    responseType: 'blob',
  }).then(res => {
    fileDownload(res.data, username + '.py');
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
}

export const handleAllDownload = (course_id, title) => {
  axios.get(`http://127.0.0.1:8000/assignments/downloadAll/${course_id}/${title}`, {
    responseType: 'blob',
  }).then(res => {
    fileDownload(res.data, title + '.zip');
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
}

export const handleFeedback = (token,username, assgn_id) => {
  return dispatch => {
    
    dispatch(getFeedbackStart());

    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };

    axios.get(`http://127.0.0.1:8000/grades/?username=${username}&assignment=${assgn_id}`)
      .then(res => {
        console.log("Username: ", username)
        console.log("Assignment: ",assgn_id)
        
        if (res.data.length > 0) {
          const feedbackInfo = {
            feedback: res.data[0].feedback,
            grade: res.data[0].grade
          };
          dispatch(getFeedbackSuccess(feedbackInfo));
        }
        else {
          const feedbackInfo = {
            feedback: 'NA',
            grade: 0
          }
          dispatch(getFeedbackSuccess(feedbackInfo));
        }
      }).catch(err => {
        dispatch(getFeedbackFail(err));
      });
  };
};



export function timeDiffCalc(dateFuture, dateNow) {

  // console.log(dateFuture.split(' '));
  if(dateFuture!==undefined){
    let empty = " ";
    dateFuture = dateFuture.split(" ")[0].split('/').reverse().join("/").concat(empty.concat(dateFuture.split(" ")[1]));
    dateNow = dateNow.split(" ")[0].split('/').reverse().join("/").concat(empty.concat(dateNow.split(" ")[1])).replace(",","");

    // .reverse().join(dateFuture.split(" ")[1]);



  // 

  // console.log(dateFuture);
  // console.log(dateNow);
  var diffInSeconds = 0;
  if((new Date(dateFuture) - new Date(dateNow))>0){
    // console.log("Time remaining")
    diffInSeconds = Math.abs(new Date(dateFuture) - new Date(dateNow))/1000;
  }
  else {
    diffInSeconds = 0;
    // console.log("Time Over")
  }
  // console.log("diff ", diffInSeconds);
  // return diffInSeconds;
  // calculate days
  const days = Math.floor(diffInSeconds / 86400);
  diffInSeconds -= days * 86400;
  // console.log('calculated days', days);

  // calculate hours
  const hours = Math.floor(diffInSeconds / 3600) % 24;
  diffInSeconds -= hours * 3600;
  // console.log('calculated hours', hours);

  // calculate minutes
  const minutes = Math.floor(diffInSeconds / 60) % 60;
  diffInSeconds -= minutes * 60;
  // console.log('minutes', minutes);

  let difference = '';
  if (days > 0) {
    difference += (days === 1) ? `${days} day, ` : `${days} days, `;
  }

  difference += (hours === 0 || hours === 1) ? `${hours} hour, ` : `${hours} hours, `;

  difference += (minutes === 0 || minutes === 1) ? `${minutes} minutes, ` : `${minutes} minutes, `; 

  difference += (diffInSeconds === 0 || diffInSeconds === 1) ? `${diffInSeconds} seconds ` : `${diffInSeconds} seconds`; 
  return difference;
}

}

export function time_remng(dateFuture, dateNow){
  if(dateFuture!==undefined){
    let empty = " ";
    dateFuture = dateFuture.split(" ")[0].split('/').reverse().join("/").concat(empty.concat(dateFuture.split(" ")[1]));
    dateNow = dateNow.split(" ")[0].split('/').reverse().join("/").concat(empty.concat(dateNow.split(" ")[1])).replace(",","");
    // console.log(dateFuture, dateNow, "in time_remg")
    var diffInSeconds = 0;
    if((new Date(dateFuture) - new Date(dateNow))>0){
      diffInSeconds = Math.abs(new Date(dateFuture) - new Date(dateNow))/1000;
    }
    else {
      diffInSeconds = 0;
    }
    return diffInSeconds>0;
  }
} 