import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
    currentMessage: {},
    inbox: [],
    outbox: [],
    error: null,
    loading: false,
};

const getInboxStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true
    });
};

const getInboxSuccess = (state, action) => {
    return updateObject(state, {
        inbox: action.inbox,
        error: null,
        loading: false
    });
};

const getInboxFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    });
};

const getOutboxStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true
    });
};

const getOutboxSuccess = (state, action) => {
    return updateObject(state, {
        outbox: action.outbox,
        error: null,
        loading: false
    });
};

const getOutboxFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    });
};

const getMsgDetailStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true
    });
};

const getMsgDetailSuccess = (state, action) => {
    return updateObject(state, {
        currentMessage: action.message,
        error: null,
        loading: false
    });
};

const getMsgDetailFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    });
};

// const createCourseStart = (state, action) => {
//     return updateObject(state, {
//         error: null,
//         loading: true
//     });
// };

// const createCourseSuccess = (state, action) => {
//     return updateObject(state, {
//         error: null,
//         loading: false
//     });
// };

// const createCourseFail = (state, action) => {
//     return updateObject(state, {
//         error: action.error,
//         loading: false
//     });
// };

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_INBOX_START:
            return getInboxStart(state, action);
        case actionTypes.GET_INBOX_SUCCESS:
            return getInboxSuccess(state, action);
        case actionTypes.GET_INBOX_FAIL:
            return getInboxFail(state, action);
        case actionTypes.GET_OUTBOX_START:
            return getOutboxStart(state, action);
        case actionTypes.GET_OUTBOX_SUCCESS:
            return getOutboxSuccess(state, action);
        case actionTypes.GET_OUTBOX_FAIL:
            return getOutboxFail(state, action);
        case actionTypes.GET_MESSAGE_DETAIL_START:
            return getMsgDetailStart(state, action);
        case actionTypes.GET_MESSAGE_DETAIL_SUCCESS:
            return getMsgDetailSuccess(state, action);
        case actionTypes.GET_MESSAGE_DETAIL_FAIL:
            return getMsgDetailFail(state, action);
        default:
            return state;
    }
};

export default reducer;