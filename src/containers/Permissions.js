import React from "react";
import { connect } from "react-redux";
import { Card, Skeleton, message, Switch } from "antd";
import Hoc from "../hoc/hoc";
import { getCourseDetail } from "../store/actions/courses";
import { Link, Redirect } from "react-router-dom";
import { Form, Input, Button, List } from "antd";

import { insertTA, updatePermissions } from "../store/actions/staff"

import axios from "axios";

// Link to this component is /courses/:id/staff/
const cardStyle = {
    marginTop: "20px",
    marginBottom: "20px"
};

class PermissionUpdate extends React.Component {

    state = {
        username: '',
        token: '',
        currentCourse: '',
        loading: '',
        title: '',
    };

    componentDidMount() {
        if (this.props.token !== undefined && this.props.token !== null) {
            console.log("Course details coming", this.props.getCourseDetail(this.props.token, this.props.match.params.id));
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.token !== this.props.token) {
            if (newProps.token !== undefined && newProps.token !== null) {
                this.props.getCourseDetail(newProps.token, this.props.match.params.id);
            }
        }
    }



    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (typeof values.add_ta == 'undefined') {
                    values.add_ta = false;
                }
                if (typeof values.make_asnts == 'undefined') {
                    values.make_asnts = false;
                }
                if (typeof values.make_announcements == 'undefined') {
                    values.make_announcements = false;
                }
                if (typeof values.upload_grades == 'undefined') {
                    values.upload_grades = false;
                }
                if (typeof values.allow_dm == 'undefined') {
                    values.allow_dm = false;
                }

                const update_data = {
                    teacher: this.props.username,
                    course: this.props.currentCourse,
                    permissions: values
                }

                this.props.updatePermissions(this.props.token, update_data)
            }
        });
    };


    render() {


        if(this.props.token == null || this.props.token == undefined) {
          return (<Redirect to="/login" />);
        }

        const FormItem = Form.Item;

        const { getFieldDecorator } = this.props.form;

        return (

            <div>
                {this.props.is_teacher ? (
                    <div>
                        <h1>Update TA Permissions</h1>
                        <Form onSubmit={this.handleSubmit}>
                            {/* <FormItem label={"Name : "} name="ta_name">
                                {getFieldDecorator(`ta_name`, {
                                    validateTrigger: ["onChange", "onBlur"],
                                    rules: [
                                        {
                                            required: false,
                                            message: "Please input TA's username"
                                        }
                                    ]
                                })(<Input placeholder="Username" />)}
                            </FormItem> */}

                            <FormItem label={"Make Assignments : "} name="make_asnts">
                                {getFieldDecorator(`make_asnts`, {
                                    initialValue: this.props.permission.make_asnts,
                                    valuePropName: "checked"
                                })(<Switch />)}
                            </FormItem>

                            <FormItem label={"Add TAs : "} name="add_ta">
                                {getFieldDecorator(`add_ta`, {
                                    initialValue: this.props.permission.add_ta,
                                    valuePropName: "checked"
                                })(<Switch />)}
                            </FormItem>

                            <FormItem label={"Make Announcements : "} name="make_announcements">
                                {getFieldDecorator(`make_announcements`, {
                                    initialValue: this.props.permission.make_announcements,
                                    valuePropName: "checked"
                                })(<Switch />)}
                            </FormItem>


                            <FormItem label={"Upload grades : "} name="upload_grades">
                                {getFieldDecorator(`upload_grades`, {
                                    initialValue: this.props.permission.upload_grades,
                                    valuePropName: "checked"
                                })(<Switch />)}
                            </FormItem>

                            <FormItem label={"Allow Communication (For students) : "} name="allow_dm">
                                {getFieldDecorator(`allow_dm`, {
                                    initialValue: this.props.permission.allow_dm,
                                    valuePropName: "checked"
                                })(<Switch />)}
                            </FormItem>


                            <FormItem>
                                <Button type="primary" htmlType="submit">
                                    Update Permissions
                                </Button>
                            </FormItem>
                        </Form>

                    </div>
                ) : null}

                <Link to={`/courses/${this.props.currentCourse.id}/`}>
                    <List.Item>Go Back</List.Item>
                </Link>
            </div>
        );

    }

};

const WrappedPermissionUpdate = Form.create()(PermissionUpdate)

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        currentCourse: state.courses.currentCourse,
        loading: state.courses.loading,
        username: state.auth.username,
        is_teacher: state.auth.is_teacher,
        title: state.auth.title,
        permission: state.courses.permission,
        // teachassists: state.courses
    };
};

const mapDispatchToProps = dispatch => {
    console.log(typeof updatePermissions)
    return {
        getCourseDetail: (token, id) => dispatch(getCourseDetail(token, id)),
        // createASNT: (token, asnt) => dispatch(createASNT(token, asnt)),
        // getASNTS: (token, username, currentCourseId) => dispatch(getASNTS(token, username, currentCourseId)),
        updatePermissions: (token, update_data) => dispatch(updatePermissions(token, update_data)),

        // insertTA: (token, TA) => dispatch(insertTA(token, TA)),

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedPermissionUpdate);

// export default StaffDetail;