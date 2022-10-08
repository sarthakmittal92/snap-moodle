import React from "react";
import { connect } from "react-redux";
import { Form, Input, Icon, Button, Divider } from "antd";
// import QuestionForm from "./QuestionForm";
import Hoc from "../hoc/hoc";
import { createAnnc } from "../store/actions/announcements";

import { Redirect } from "react-router-dom";
const FormItem = Form.Item;

class AnnouncementCreate extends React.Component {
    // state = {
    //   formCount: 1
    // };

    // remove = () => {
    //   const { formCount } = this.state;
    //   this.setState({
    //     formCount: formCount - 1
    //   });
    // };

    // add = () => {
    //   const { formCount } = this.state;
    //   this.setState({
    //     formCount: formCount + 1
    //   });
    // };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log("Received values of form: ", values);
                const annc = {
                    teacher: this.props.username,
                    title: values.title,
                    message: values.message,
                };
                this.props.createAnnc(this.props.token, annc);
                console.log("okay2")
            }
        });
    };

    render() {
        if(this.props.token == null || this.props.token == undefined) {
            return (<Redirect to="/login" />);
        }
        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit}>
                <h1>Create an announcement</h1>
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

                {/* <FormItem label={"Code: "}>
                    {getFieldDecorator(`accessCode`, {
                        validateTrigger: ["onChange", "onBlur"],
                        rules: [
                            {
                                required: true,
                                message: "Please input an access code"
                            }
                        ]
                    })(<Input placeholder="Add an access code" />)}
                </FormItem> */}

                <FormItem>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </FormItem>

            </Form>
        );
    }
}

const WrappedAnnouncementCreate = Form.create()(AnnouncementCreate);

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        username: state.auth.username,
        loading: state.announcements.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        createAnnc: (token, annc) => dispatch(createAnnc(token, annc))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedAnnouncementCreate);