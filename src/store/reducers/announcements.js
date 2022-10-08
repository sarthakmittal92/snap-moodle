import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
    announcements: [],
    // codes: [],
    token: '',
    currentAnnouncement: {},
    error: null,
    loading: false
};

const getAnncListStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true
    });
};

const getAnncListSuccess = (state, action) => {
    return updateObject(state, {
        announcements: action.announcements,
        error: null,
        loading: false
    });
};

const getAnncListFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    });
};

const getAnncDetailStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true
    });
};

const getAnncDetailSuccess = (state, action) => {
    return updateObject(state, {
        currentAnnouncement: action.announcement,
        error: null,
        loading: false
    });
};

const getAnncDetailFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    });
};

const createAnncStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true
    });
};

const createAnncSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: false
    });
};

const createAnncFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ANNOUNCEMENT_LIST_START:
            return getAnncListStart(state, action);
        case actionTypes.GET_ANNOUNCEMENTS_LIST_SUCCESS:
            return getAnncListSuccess(state, action);
        case actionTypes.GET_ANNOUNCEMENTS_LIST_FAIL:
            return getAnncListFail(state, action);
        case actionTypes.GET_ANNOUNCEMENT_DETAIL_START:
            return getAnncDetailStart(state, action);
        case actionTypes.GET_ANNOUNCEMENT_DETAIL_SUCCESS:
            return getAnncDetailSuccess(state, action);
        case actionTypes.GET_ANNOUNCEMENT_DETAIL_FAIL:
            return getAnncDetailFail(state, action);
        case actionTypes.CREATE_ANNOUNCEMENT_START:
            return createAnncStart(state, action);
        case actionTypes.CREATE_ANNOUNCEMENT_SUCCESS:
            return createAnncSuccess(state, action);
        case actionTypes.CREATE_ASSIGNMENT_FAIL:
            return createAnncFail(state, action);
        default:
            return state;
    }
};

export default reducer;