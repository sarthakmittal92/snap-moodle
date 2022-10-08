import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Profile from "./containers/Profile";
// import AssignmentList from "./containers/AssignmentList";
import AssignmentDetail from "./containers/AssignmentDetail";
import AssignmentCreate from "./containers/AssignmentCreate";
import CourseList from "./containers/CourseList";
import CourseCreate from "./containers/CourseCreate";
import CourseDetail from "./containers/CourseDetail";
import GradeList from "./containers/GradeList";
import GradeDetail from "./containers/GradeDetail";
import StaffDetail from "./containers/Staff";
import AnnouncementList from "./containers/AnnouncementList";
import AnnouncementDetail from "./containers/AnnouncementDetail";
import Message from "./containers/Message";
import MessageDetail from "./containers/MessageDetail";
import PermissionUpdate from "./containers/Permissions";
import PasswordUpdate from "./containers/Password";

const BaseRouter = () => (
  <Hoc>
    <Route exact path="/create/" component={CourseCreate} />
    <Route exact path="/courses/:id" component={CourseDetail} />
    <Route exact path="/login/" component={Login} />
    <Route exact path="/signup/" component={Signup} />
    <Route exact path="/courses/:cid/assignments/:id" component={AssignmentDetail} />
    <Route exact path="/profile/:id" component={Profile} />
    <Route exact path="/profile/:id/update_password" component={PasswordUpdate} />
    <Route exact path="/courses/:id/grades/" component={GradeList} />
    <Route exact path="/courses/:id/grades/:assignment_id" component={GradeDetail} />
    <Route exact path="/courses/:id/staff" component={StaffDetail} />
    <Route exact path="/courses/:id/announcements" component={AnnouncementList} />
    <Route exact path="/announcements/:id" component={AnnouncementDetail} />
    <Route exact path="/messaging/" component={Message} />
    <Route exact path="/users/messaging/:id" component={MessageDetail} />
    <Route exact path="/courses/:id/permissions" component={PermissionUpdate} />
    <Route exact path="/" component={CourseList} />
  </Hoc>
);

export default BaseRouter;
