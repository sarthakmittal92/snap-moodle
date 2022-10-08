import React from "react";
import { connect } from "react-redux";
import { Card, Skeleton, message, Switch } from "antd";
import Hoc from "../hoc/hoc";
import { getCourseDetail } from "../store/actions/courses";
import { Link, Redirect } from "react-router-dom";
import { Form, Input, Button, List } from "antd";

import { insertTA } from "../store/actions/staff"
import { checkTA } from "../store/actions/auth";

import axios from "axios";

// Link to this component is /courses/:id/staff/
const cardStyle = {
    marginTop: "20px",
    marginBottom: "20px"
};

class StaffDetail extends React.Component {

    state = {
        username: '',
        token: '',
        currentCourse: '',
        loading: '',
        title: '',
        user_name: ''
    };

    checkTA(token, course, username) {
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        };
        axios
            .get(`http://127.0.0.1:8000/users/checkta/${course}/${username}`)
            .then(res => {
                console.log(res.data)
                localStorage.setItem("tacheck2", res.data)
            })
            .catch(err => {
                console.log(err)
            });
    }

    componentDidMount() {
        if (this.props.token !== undefined && this.props.token !== null) {
            console.log("Course details coming", this.props.getCourseDetail(this.props.token, this.props.match.params.id));
            this.props.checkTA(this.props.token, this.props.currentCourse.id, this.props.username);
            this.props.getCourseDetail(this.props.token, this.props.match.params.id);
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.token !== this.props.token) {
            if (newProps.token !== undefined && newProps.token !== null) {
                this.props.getCourseDetail(newProps.token, this.props.match.params.id);
                this.props.checkTA(this.props.token, this.props.currentCourse.id, this.props.username);
            }
        }
    }

    renderItem(item) {
        console.log(item)
        axios
            .get(`http://127.0.0.1:8000/users/teachassists/${item}`)
            .then(res => {
                // const { username } = res.data
                // const uname = { user_name:username }
                localStorage.setItem(item, res.data.student_name)

            })
            .catch(err => {
                console.log("TA error")
            });
        const our_user_name = localStorage.getItem(item)
        console.log("local", localStorage.getItem(item))
        console.log("our", our_user_name)

        return (
            // <Link to={`/assignments/${item.id}`}>
            <List.Item>{our_user_name}</List.Item>
            // </Link>
        );
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const TA = {
                    teacher: this.props.username,
                    username: values.ta_name,
                    course: this.props.currentCourse
                };
                this.props.insertTA(this.props.token, TA);
                this.props.getCourseDetail(this.props.token, this.props.match.params.id);
                this.props.checkTA(this.props.token, this.props.currentCourse.id, this.props.username);
            }
        });
    };

    assignBool (boolean, tacheck) {
        if (boolean == 'true') {
            tacheck = true;
        }
        else {
            tacheck = false;
        }
    }

    render() {

        if(this.props.token == null || this.props.token == undefined) {
            return (<Redirect to="/login" />);
          }

        const FormItem = Form.Item;

        const { getFieldDecorator } = this.props.form;

        // var boolean = localStorage.getItem("tacheck2")
        // var tacheck = false
        // { this.assignBool(boolean,tacheck) }
        // console.log("Boolean: ", boolean)
        // console.log("Tacheck: ", tacheck)

        return (

            <div>
                <h1>
                    Manage here
                </h1>

                <Hoc>
                    {this.props.loading ? (
                        <Skeleton active />
                    ) : (

                        <div>
                            <h3 style={{ margin: "16px 0" }}>Participants List</h3>
                            <List
                                size="large"
                                bordered
                                dataSource={this.props.teachassists}
                                renderItem={item => this.renderItem(item)}
                            />
                        </div>


                    )}
                </Hoc>

                {/* {this.checkTA(this.props.token, this.props.currentCourse.id, this.props.username)} */}
                {this.props.is_teacher || (this.props.permission.add_ta && this.props.is_ta) ? (
                    <div>

                        <h1>Add TA</h1>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem label={"Name : "} name="ta_name">
                                {getFieldDecorator(`ta_name`, {
                                    validateTrigger: ["onChange", "onBlur"],
                                    rules: [
                                        {
                                            required: false,
                                            message: "Please input TA's username"
                                        }
                                    ]
                                })(<Input placeholder="Username" />)}
                            </FormItem>
                            <FormItem>
                                <Button type="primary" htmlType="submit">
                                    Add
                                </Button>
                            </FormItem>
                        </Form>

                    </div>
                ) : null}

                {this.props.is_teacher ? (
                    <div>
                        <Link to={`/courses/${this.props.currentCourse.id}/permissions`}>
                            <List.Item>Change Permissions</List.Item>
                        </Link>
                    </div>
                ) : null}

                <Link to={`/courses/${this.props.currentCourse.id}/`}>
                    <List.Item>Go Back</List.Item>
                </Link>
            </div>
        );
    }

};

const WrappedStaffDetail = Form.create()(StaffDetail)

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        currentCourse: state.courses.currentCourse,
        loading: state.courses.loading,
        username: state.auth.username,
        is_teacher: state.auth.is_teacher,
        title: state.auth.title,
        teachassists: state.courses.currentCourse.teachassists,
        permission: state.courses.permission,
        is_ta: state.auth.is_ta
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getCourseDetail: (token, id) => dispatch(getCourseDetail(token, id)),
        // createASNT: (token, asnt) => dispatch(createASNT(token, asnt)),
        // getASNTS: (token, username, currentCourseId) => dispatch(getASNTS(token, username, currentCourseId)),
        insertTA: (token, TA) => dispatch(insertTA(token, TA)),
        checkTA: (token, courseId, username) => dispatch(checkTA(token, courseId, username)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedStaffDetail);

// export default StaffDetail;