import React from "react";
import { connect } from "react-redux";
import { Card, Skeleton, message, Switch } from "antd";
import Hoc from "../hoc/hoc";
import { getCourseDetail } from "../store/actions/courses";
import { Link, Redirect } from "react-router-dom";
import { Form, Icon, Select, Input, Button, List } from "antd";

import { insertTA, updatePermissions } from "../store/actions/staff"
import { generateOTP } from "../store/actions/auth"

import axios from "axios";

// Link to this component is /courses/:id/staff/
const cardStyle = {
    marginTop: "20px",
    marginBottom: "20px"
};

class PasswordUpdate extends React.Component {

    state = {
        username: '',
        token: '',
        currentCourse: '',
        loading: '',
        title: '',
        otp_wrong: false,
        otp_right: false,
        otp_sent: false,
        confirmDirt: false,
    };

    handleOTP = (e) => {
        e.preventDefault();
        this.props.generateOTP(this.props.token, this.props.username);
        this.state.otp_sent = true;
    };

    handleConfirmBlur = e => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue("password")) {
            callback("Two passwords that you enter is inconsistent!");
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(["confirm"], { force: true });
        }
        callback();
    };


    sendOTPMail = (token, username) => {

        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        };
        console.log(token)
        console.log(username)
        console.log("auth.js")
        axios
            .get(`http://127.0.0.1:8000/users/sendOTP/${this.props.userId}`, {
                username: username,
            })
            .then(res => {
                // const user = {
                //   token: res.data.key,
                //   username,
                //   userId: res.data.user,
                //   is_student: res.data.user_type.is_student,
                //   is_teacher: res.data.user_type.is_teacher,
                //   expirationDate: new Date(new Date().getTime() + 3600 * 1000)
                // };
                console.log(res.data)
                // localStorage.setItem("user", JSON.stringify(user));
                // dispatch(authSuccess(user));
                // dispatch(checkAuthTimeout(3600));
            })
            .catch(err => {
                console.log("error in auth.js in actions")
            });
    }

    componentDidMount() {
        // send mail  here
        // this.sendOTPMail(this.props.token, this.props.username)
        if (this.props.token !== undefined && this.props.token !== null) {
            // console.log("Course details coming", this.props.getCourseDetail(this.props.token, this.props.match.params.id));
            console.log("rendered")

        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.token !== this.props.token) {
            if (newProps.token !== undefined && newProps.token !== null) {
                // this.props.getCourseDetail(newProps.token, this.props.match.params.id);
            }
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (values.otp == this.props.otp) {
                this.state.otp_right = true;
                this.state.otp_wrong = false;
            }
            else {
                this.state.otp_right = false;
                this.state.otp_wrong = true;
            }
        });
    };

    handlePasswordUpdate = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            axios.defaults.headers = {
                "Content-Type": "application/json",
                Authorization: `Token ${this.props.token}`
            };
            const update_data = { password: values.password }
            axios
                .post(`http://127.0.0.1:8000/users/update_password/${this.props.username}`, update_data)
                .then(res => {
                    console.log("Axios done")

                })
                .catch(err => {
                    console.log(err)
                });
        });
    };


    render() {

        if(this.props.token == null || this.props.token == undefined) {
          return (<Redirect to="/login" />);
        }

        const FormItem = Form.Item;

        const { getFieldDecorator } = this.props.form;

        var otp_wrong = false;

        console.log(this.props.otp)


        return (

            <div>

                <Form onSubmit={this.handleOTP}>
                    <Button type="primary" htmlType="submit">
                        Send OTP
                    </Button>
                </Form>

                {this.state.otp_sent ? (
                    <div>
                        <br />
                        <h2>An OTP has been sent to the registered email. Please enter the OTP to proceed.</h2>
                        <Form onSubmit={this.handleSubmit}>

                            <FormItem label={"OTP: "}>
                                {getFieldDecorator(`otp`, {
                                    validateTrigger: ["onChange", "onBlur"],
                                    rules: [
                                        {
                                            required: true,
                                            message: "Please input the OTP"
                                        }
                                    ]
                                })(<Input placeholder="" />)}
                            </FormItem>

                            <FormItem>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </FormItem>
                        </Form>
                        {this.state.otp_wrong ?
                            (<div>

                                Incorrect OTP entered.

                            </div>)
                            :
                            (null)
                        }

                        {this.state.otp_right ?
                            (<div>
                                <br /> <br />
                                <h2> Please enter the new password: </h2>
                                <Form onSubmit={this.handlePasswordUpdate}>
                                    <FormItem>
                                        {getFieldDecorator("password", {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: "Please input your password!"
                                                },
                                                {
                                                    validator: this.validateToNextPassword
                                                }
                                            ]
                                        })(
                                            <Input
                                                prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
                                                type="password"
                                                placeholder="Password"
                                            />
                                        )}
                                    </FormItem>

                                    <FormItem>
                                        {getFieldDecorator("confirm", {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: "Please confirm your password!"
                                                },
                                                {
                                                    validator: this.compareToFirstPassword
                                                }
                                            ]
                                        })(
                                            <Input
                                                prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
                                                type="password"
                                                placeholder="Confirm Password"
                                                onBlur={this.handleConfirmBlur}
                                            />
                                        )}
                                    </FormItem>

                                    <FormItem>
                                        <Button type="primary" htmlType="submit">
                                            Change Password
                                        </Button>
                                    </FormItem>

                                </Form>
                            </div>)
                            :
                            (null)
                        }


                    </div>
                ) : (null)
                }


                <Link to={`/profile/${this.props.userId}/`}>
                    <List.Item>Go Back</List.Item>
                </Link>
            </div >
        );

    }

};

const WrappedPasswordUpdate = Form.create()(PasswordUpdate)

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        currentCourse: state.courses.currentCourse,
        username: state.auth.username,
        is_teacher: state.auth.is_teacher,
        title: state.auth.title,
        permission: state.courses.permission,
        userId: state.auth.userId,
        otp: state.auth.otp,
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
        generateOTP: (token, username) => dispatch(generateOTP(token, username)),

        // insertTA: (token, TA) => dispatch(insertTA(token, TA)),

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedPasswordUpdate);

// export default StaffDetail;