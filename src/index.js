import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { unregister } from "./registerServiceWorker";
import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import authReducer from "./store/reducers/auth";
import assignmentReducer from "./store/reducers/assignments";
import announcementReducer from "./store/reducers/announcements";
import courseReducer from "./store/reducers/courses"
import gradeReducer from "./store/reducers/grades";
import messagingReducer from "./store/reducers/messages"
const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  auth: authReducer,
  assignments: assignmentReducer,
  courses: courseReducer,
  announcements: announcementReducer,
  messaging: messagingReducer,
  grades: gradeReducer,
});

const store = createStore(rootReducer, composeEnhances(applyMiddleware(thunk)));

const app = (
  <Provider store={store}>
  <App />
  </Provider>
  );

ReactDOM.render(app, document.getElementById("root"));
unregister();
