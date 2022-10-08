import React from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { Form, Input, Button, List, Skeleton } from "antd";

import * as auth_actions from "../store/actions/auth"
import * as annc_actions from "../store/actions/announcements";
import * as course_actions from "../store/actions/courses";
import { checkTA } from "../store/actions/auth";

import { WrappedAnnouncementCreate } from "./AnnouncementCreate";
import Hoc from "../hoc/hoc";
import axios from "axios";


class AnnouncementList extends React.PureComponent {

    checkTA(token, course, username) {
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        };
        axios
            .get(`http://127.0.0.1:8000/users/checkta/${course}/${username}`)
            .then(res => {
                localStorage.setItem("tacheck2", res.data)

                console.log(username)
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            });
    }

    componentDidMount() {
        if (this.props.token !== undefined && this.props.token !== null) {
            this.props.getAnncs(this.props.token, this.props.username, this.props.currentCourse.id);
            this.props.getCourseDetail(this.props.token, this.props.match.params.id);
            this.props.checkTA(this.props.token, this.props.currentCourse.id, this.props.username);
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.token !== this.props.token) {
            if (newProps.token !== undefined && newProps.token !== null) {
                this.props.getAnncs(this.props.token, this.props.username, this.props.currentCourse.id);
                this.props.getCourseDetail(newProps.token, this.props.match.params.id);
                this.props.checkTA(this.props.token, this.props.currentCourse.id, this.props.username);
            }
        }
    }

    renderItem(item) {
        return (
            <Link to={`/announcements/${item.id}`}>
                <List.Item>{item.title}</List.Item>
            </Link>
        );
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log("Received values of form: ", values);
                const annc = {
                    teacher: this.props.username,
                    title: values.title,
                    message: values.message,
                    course: this.props.currentCourse.id,

                };
                this.props.createAnnc(this.props.token, annc);
                console.log("okay2");
                this.props.checkTA(this.props.token, this.props.currentCourse.id, this.props.username);
            }
        });
    };

    render() {
        if(this.props.token == null || this.props.token == undefined) {
            return (<Redirect to="/login" />);
        }
        const FormItem = Form.Item;
        const { getFieldDecorator } = this.props.form;
        const { Search } = Input;
        const onSearch = value => {
            console.log(value);
        }


        // this.checkTA(this.props.token, this.props.currentCourse.id, this.props.username)
        // var boolean = localStorage.getItem("tacheck2")

        // var tacheck = false
        // { boolean == 'true' ? tacheck = true : null }

        // console.log("tacheck is ")
        // console.log(tacheck)
        // console.log("THIS")
        // console.log(this.props.is_ta)
        // console.log("make announcments is")
        // console.log(this.props.permission.make_announcements)

        console.log("These: ")
        console.log(this.props.is_ta)
        console.log(this.props.permission.make_announcements)

        return (
            <div>
                <Hoc>
                    {this.props.loading ? (
                        <Skeleton active />
                    ) : (
                        <div>
                            <h3 style={{ margin: "16px 0" }}>Announcement List</h3>
                            <List
                                size="large"
                                bordered
                                dataSource={this.props.announcements}
                                renderItem={item => this.renderItem(item)}
                            />
                        </div>
                    )}
                </Hoc>


                {this.props.is_teacher || (this.props.permission.make_announcements && this.props.is_ta) ? (
                    <div>
                        <h1>Create an announcement</h1>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem label={"Title: "}>
                                {getFieldDecorator(`title`, {
                                    validateTrigger: ["onChange", "onBlur"],
                                    rules: [
                                        {
                                            required: true,
                                            message: "Please input a title"
                                        }
                                    ]
                                })(<Input placeholder="Add a title" />)}
                            </FormItem>

                            <FormItem label={"Message: "}>
                                {getFieldDecorator(`message`, {
                                    validateTrigger: ["onChange", "onBlur"],
                                    rules: [
                                        {
                                            required: true,
                                            message: "Please input the message"
                                        }
                                    ]
                                })(<Input placeholder="Add a message" />)}
                            </FormItem>

                            <FormItem>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </FormItem>

                        </Form>

                    </div>
                ) : null}
            </div>
        );

    }
}

const WrappedAnnouncementUpdate = Form.create()(AnnouncementList)

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        username: state.auth.username,
        loading: state.announcements.loading,
        is_teacher: state.auth.is_teacher,
        currentCourse: state.courses.currentCourse,
        announcements: state.announcements.announcements,
        permission: state.courses.permission,
        is_ta: state.auth.is_ta,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAnncs: (token, username, course) =>
            dispatch(
                annc_actions.getAnncs(token, username, course)
            ),
        createAnnc: (token, annc) => dispatch(annc_actions.createAnnc(token, annc)),
        getCourseDetail: (token, id) => dispatch(course_actions.getCourseDetail(token, id)),
        checkTA: (token, courseId, username) => dispatch(checkTA(token, courseId, username)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedAnnouncementUpdate);