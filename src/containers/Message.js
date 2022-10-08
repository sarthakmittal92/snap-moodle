import React from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { Form, Input, Button, List, Skeleton } from "antd";

import * as auth_actions from "../store/actions/auth"
import * as msg_actions from "../store/actions/messages"
import { checkTA } from "../store/actions/auth";


// import { WrappedAnnouncementCreate } from "./AnnouncementCreate";
import Hoc from "../hoc/hoc";

class Message extends React.PureComponent {

    componentDidMount() {
        if (this.props.token !== undefined && this.props.token !== null) {
            this.props.getInbox(this.props.token, this.props.username);
            this.props.getOutbox(this.props.token, this.props.username);
            this.props.checkTA(this.props.token, this.props.currentCourse.id, this.props.username);

        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.token !== this.props.token) {
            if (newProps.token !== undefined && newProps.token !== null) {
                this.props.getInbox(this.props.token, this.props.username);
                this.props.getOutbox(this.props.token, this.props.username);
                this.props.checkTA(this.props.token, this.props.currentCourse.id, this.props.username);

            }
        }
    }

    renderItem(item) {
        return (
            <Link to={`/users/messaging/${item.id}`}>
                <List.Item>{item.msg_content}</List.Item>
            </Link>
        );
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log("Received values of form: ", values);
                const msg = {
                    sender: this.props.username,
                    receiver: values.receiver,
                    message: values.message,
                };
                this.props.msgSend(this.props.token, msg);
                // console.log("okay2")
                if (this.props.token !== undefined && this.props.token !== null) {
                    this.props.getOutbox(this.props.token, this.props.username);
                }
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

        // console.log(this.props.outbox);

        // console.log("These: ")
        // console.log(this.props.is_teacher || this.props.is_ta || this.props.permission.allow_dm)

        return (
            <div>
                <Hoc>
                    {this.props.loading ? (
                        <Skeleton active />
                    ) : (
                        <div>
                            <h3 style={{ margin: "16px 0" }}>Inbox</h3>
                            <List
                                size="large"
                                bordered
                                dataSource={this.props.inbox}
                                renderItem={item => this.renderItem(item)}
                            />
                        </div>
                    )}
                </Hoc>

                <Hoc>
                    {this.props.loading ? (
                        <Skeleton active />
                    ) : (
                        <div>
                            <h3 style={{ margin: "16px 0" }}>Outbox</h3>
                            <List
                                size="large"
                                bordered
                                dataSource={this.props.outbox}
                                renderItem={item => this.renderItem(item)}
                            />
                        </div>
                    )}
                </Hoc>
                {(this.props.is_teacher || this.props.is_ta || this.props.permission.allow_dm) ?

                    (
                        <div>
                            <h1>Send Message</h1>
                            <Form onSubmit={this.handleSubmit}>
                                <FormItem label={"Receiver Username: "}>
                                    {getFieldDecorator(`receiver`, {
                                        validateTrigger: ["onChange", "onBlur"],
                                        rules: [
                                            {
                                                required: true,
                                                message: "Please input receiver username"
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
                    ) : (
                        <div>
                            <br /> <br />
                            <h2> DMs have been temporarily disabled by the instructor. </h2>
                        </div>
                    )
                }
            </div>
        );

    }
}

const WrappedMessageUpdate = Form.create()(Message)

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        username: state.auth.username,
        loading: state.messaging.loading,
        is_teacher: state.auth.is_teacher,
        inbox: state.messaging.inbox,
        outbox: state.messaging.outbox,
        is_ta: state.auth.is_ta,
        currentCourse: state.courses.currentCourse,
        permission: state.courses.permission,
        // announcements: state.announcements.announcements,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getInbox: (token, userid) => dispatch(msg_actions.getInbox(token, userid)),
        getOutbox: (token, userid) => dispatch(msg_actions.getOutbox(token, userid)),
        msgSend: (token, msg) => dispatch(msg_actions.messageSend(token, msg)),
        checkTA: (token, courseId, username) => dispatch(checkTA(token, courseId, username)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedMessageUpdate);