import React from "react";
import { connect } from "react-redux";
import { Form, Input, Icon, Button, Divider } from "antd";
// import QuestionForm from "./QuestionForm";
import Hoc from "../hoc/hoc";
import { createCourse } from "../store/actions/courses";

import { Redirect } from "react-router-dom";
const FormItem = Form.Item;

class CourseCreate extends React.Component {

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        const course = {
          teacher: this.props.username,
          title: values.title,
          code: values.accessCode
        };
        console.log(course['code'])
        this.props.createCourse(this.props.token, course);
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
      <h1>Create a course</h1>
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

const WrappedCourseCreate = Form.create()(CourseCreate);

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    username: state.auth.username,
    loading: state.courses.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createCourse: (token, course) => dispatch(createCourse(token, course))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(WrappedCourseCreate);
