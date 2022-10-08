import React from "react";
import { connect } from "react-redux";
import { Form, Input, Icon, Button, Divider } from "antd";
// import QuestionForm from "./QuestionForm";
import Hoc from "../hoc/hoc";
import { createASNT } from "../store/actions/assignments";

import { Redirect } from "react-router-dom";
const FormItem = Form.Item;

class AssignmentCreate extends React.Component {
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
        const asnt = {
          teacher: this.props.username,
          title: values.title,
          problemStatement: values.problemStatement,
          code: values.accessCode
        };
        console.log(asnt['code'])
        this.props.createASNT(this.props.token, asnt);
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
        <h1>Create an assignment</h1>
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

        <FormItem label={"Problem: "}>
          {getFieldDecorator(`problemStatement`, {
            validateTrigger: ["onChange", "onBlur"],
            rules: [
              {
                required: true,
                message: "Please input a problem statement"
              }
            ]
          })(<Input placeholder="Add a problem statement" />)}
        </FormItem>

        <FormItem label={"Code: "}>
          {getFieldDecorator(`accessCode`, {
            validateTrigger: ["onChange", "onBlur"],
            rules: [
              {
                required: true,
                message: "Please input an access code"
              }
            ]
          })(<Input placeholder="Add an access code" />)}
        </FormItem>

        <FormItem>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </FormItem>

      </Form>
    );
  }
}

const WrappedAssignmentCreate = Form.create()(AssignmentCreate);

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    username: state.auth.username,
    loading: state.assignments.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createASNT: (token, asnt) => dispatch(createASNT(token, asnt))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedAssignmentCreate);
