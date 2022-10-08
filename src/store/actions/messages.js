import axios from "axios";
import * as actionTypes from "./actionTypes";

const messageStart = () => {
    return {
        type: actionTypes.MESSAGE_START
    };
};

const messageSuccess = message => {
    return {
        type: actionTypes.MESSAGE_SUCCESS,
        message
    };
};

const messageFail = error => {
    return {
        type: actionTypes.MESSAGE_FAIL,
        error: error
    };
};

export const messageSend = (token, msg) => {
    return dispatch => {
        dispatch(messageStart());
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        };

        axios
            .post(`http://127.0.0.1:8000/users/messaging/`, msg)
            .then(res => {
                console.log("just posted this ", msg);
                dispatch(messageSuccess(msg));

                dispatch(getOutboxStart());
                axios.defaults.headers = {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`
                };
                axios
                    .get(`http://127.0.0.1:8000/users/messaging/?sender=${msg.sender}`)
                    .then(res => {
                        const msgs = res.data;
                        dispatch(getOutboxSuccess(msgs));
                    })
                    .catch(err => {
                        dispatch(getOutboxFail());
                    });


            })
            .catch(err => {
                dispatch(messageFail());
            });
    };
};

const getInboxStart = () => {
    return {
        type: actionTypes.GET_INBOX_START
    };
};

const getInboxSuccess = inbox => {
    return {
        type: actionTypes.GET_INBOX_SUCCESS,
        inbox
    };
};

const getInboxFail = error => {
    return {
        type: actionTypes.GET_INBOX_FAIL,
        error: error
    };
};

const getOutboxStart = () => {
    return {
        type: actionTypes.GET_OUTBOX_START
    };
};

const getOutboxSuccess = outbox => {
    return {
        type: actionTypes.GET_OUTBOX_SUCCESS,
        outbox
    };
};

const getOutboxFail = error => {
    return {
        type: actionTypes.GET_OUTBOX_FAIL,
        error: error
    };
};

export const getInbox = (token, userid) => {
    return dispatch => {
        dispatch(getInboxStart());
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        };
        axios
            .get(`http://127.0.0.1:8000/users/messaging/?receiver=${userid}`)
            .then(res => {
                const msgs = res.data;
                console.log("Backend returned Inbox ", msgs);
                console.log("the user is ", userid);
                dispatch(getInboxSuccess(msgs));
            })
            .catch(err => {
                dispatch(getInboxFail(err));
            });
    };
};

export const getOutbox = (token, userid) => {
    return dispatch => {
        dispatch(getOutboxStart());
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        };
        axios
            .get(`http://127.0.0.1:8000/users/messaging/?sender=${userid}`)
            .then(res => {
                const msgs = res.data;
                console.log("the user is ", userid);
                console.log("Backend returned outbox ", msgs);
                dispatch(getOutboxSuccess(msgs));
            })
            .catch(err => {
                dispatch(getOutboxFail());
            });
    };
};

const getMsgDetailStart = () => {
    return {
        type: actionTypes.GET_MESSAGE_DETAIL_START
    };
};

const getMsgDetailSuccess = message => {
    return {
        type: actionTypes.GET_MESSAGE_DETAIL_SUCCESS,
        message
    };
};

const getMsgDetailFail = error => {
    return {
        type: actionTypes.GET_MESSAGE_DETAIL_FAIL,
        error: error
    };
};

export const getMsgDetail = (token, id) => {
    return dispatch => {
        dispatch(getMsgDetailStart());
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        };
        axios
            .get(`http://127.0.0.1:8000/users/messaging/${id}/`)
            .then(res => {
                const message = res.data;
                dispatch(getMsgDetailSuccess(message));
            })
            .catch(err => {
                dispatch(getMsgDetailFail());
            });
    };
};