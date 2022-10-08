import React from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { Form, Input, Button, List, Skeleton, Progress } from "antd";
import * as actions from "../store/actions/courses";
import Hoc from "../hoc/hoc";
import axios from "axios";
import {
  BookOutlined 
} from '@ant-design/icons';


class CourseList extends React.PureComponent {
  componentDidMount() {
    if (this.props.token !== undefined && this.props.token !== null) {
      this.props.getCourses(this.props.token, this.props.username, this.props.accessCode);
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.token !== this.props.token) {
      if (newProps.token !== undefined && newProps.token !== null) {
        this.props.getCourses(newProps.token, newProps.username, newProps.accessCode);
      }
    }
  }

  renderItem(item) {
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${this.props.token}`
    };

    axios
      .get(`http://127.0.0.1:8000/grades/totals/?course_id=${item.id}&username=${this.props.username}`)
      .then(res => {
        const course_data = res.data;
        localStorage.setItem(course_data.course_id, course_data.course_total)
      })
      .catch(err => {
        console.log("Error occurred while obtaining the course total for " + this.props.username)
        console.log(err)
      });
    return (
      <Link to={`/courses/${item.id}`}>
        <List.Item>
        {item.title}
        {this.props.is_student ? <Progress percent={parseFloat(localStorage.getItem(item.id))} /> : null}
        </List.Item>
      </Link>
    );
  }

  updateCourse = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // let is_student = false;
        // if (values.userType === "student") is_student = true;
        this.props.getCourses(
          this.props.token,
          this.props.username,
          values.accessCode,
        );
        // this.props.history.push("/");
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


    return (
      <div>
      <Hoc>
        {this.props.loading ? (
          <Skeleton active />
        ) : (
          <div>
            <h3 style={{ margin: "16px 0" }}><BookOutlined /> Course List</h3>
            <List
              size="large"
              bordered
              dataSource={this.props.courses}
              renderItem={item => this.renderItem(item)}
            />
          </div>
        )}
      </Hoc>
      <Form onSubmit={this.updateCourse}>
      <FormItem label={"Code: "}>
        {getFieldDecorator(`accessCode`, {
          // validateTrigger: ["onChange", "onBlur"],
          rules: [
            {
              required: false,
              message: "Please input an access code (less than 10 characters)"
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
  </div>
    );
  }
}

const WrappedCourseUpdate = Form.create()(CourseList)

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    username: state.auth.username,
    courses: state.courses.courses,
    loading: state.courses.loading,
    is_student: state.auth.is_student
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCourses: (token, username, accessCode) =>
      dispatch(
        actions.getCourses(token, username, accessCode)
      )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedCourseUpdate);
