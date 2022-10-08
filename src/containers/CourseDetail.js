import React, { useState } from "react";
import { connect } from "react-redux";
import { Card, Skeleton, message } from "antd";
import { getASNTSDetail, handlePDFDownload, handleAllDownload, handleGrades, handleFeedback, time_remng } from "../store/actions/assignments";
// import { getASNTSDetail, handlePDFDownload, handleAllDownload,  } from "../store/actions/assignments";
// import { createGradedASNT } from "../store/actions/gradedAssignments";
import Hoc from "../hoc/hoc";
import { getCourseDetail } from "../store/actions/courses";
import { Link, Redirect } from "react-router-dom";
import { Form, Input, Icon, List , Button, Divider, DatePicker, Calendar, Badge } from "antd";
import moment from 'moment';
import { getASNTS, createASNT } from "../store/actions/assignments";
import { checkTA } from "../store/actions/auth";

import "../styles.css";
import axios from "axios";

import {
  UserOutlined ,
  CommentOutlined,
  FileAddTwoTone,
  FileAddOutlined,
  NotificationTwoTone,
  FileTwoTone,
  TrophyTwoTone,
  
  DownloadOutlined,
  DownCircleTwoTone,
  UpCircleTwoTone,
  ClockCircleOutlined,
  EditOutlined,
  PieChartTwoTone
} from '@ant-design/icons';

const cardStyle = {
  marginTop: "20px",
  marginBottom: "20px"
};

var deadline_dict = {}
let mark = []

// DatePicker
function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

// moment().utcOffset("+05:30");
function disabledDate(current) {
  // Can not select days before today 
  return current && current < moment().startOf('day');
}


function disabledDateTime() {
  return {

  };
}

function getListData(value) {
  let listData = [];
  // const key = Object.keys(deadline_dict).find(key => deadline_dict[key] === value.format('DD/MM/YYYY').toLocaleString());
  const all_keys = Object.keys(deadline_dict).filter(k => deadline_dict[k] === value.format('DD/MM/YYYY').toLocaleString());
  // console.log(key)
  // if (deadline_dict[key]==value.format('DD/MM/YYYY')) {
  //   console.log("yes ", value.format('DD/MM/YYYY'))
  //   listData = [
  //     { type: 'warning', content: key },
  //   ];
  // } else {
  //   console.log("No")
  // }
  for (let key in all_keys) {
    listData.push(
      { type: 'warning', content: all_keys[key] }
    );
  }
  return listData || [];
}

function dateCellRender(value) {
  const listData = getListData(value);
  return (
    <ul className="events">
    {listData.map(item => (
      <li key={item.content}>
      <Badge status={item.type} text={item.content} />
      </li>
      ))}
    </ul>
    );
}

function getMonthData(value) {
}

function monthCellRender(value) {
  const num = getMonthData(value);
  return num ? (
    <div>
   </div>
    ) : null;
}


class CourseDetail extends React.Component {

  onChange = date => this.setState({ date });
  state = {
    username: '',
    token: '',
    currentCourse: '',
    loading: '',
    title: '',
    showCreateForm: false,  
  }

  showCreateForm = this.showCreateForm.bind(this);

  checkTA (token, course, username) {
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .get(`http://127.0.0.1:8000/users/checkta/${course}/${username}`)
      .then(res => {
        localStorage.setItem("tachecker", res.data)
        // if (res.data == 'false') {
        //   return false
        // }
        // else {
        //   return true
        // }
      })
      .catch(err => {
        console.log(err)
      });
  }

  componentDidMount() {
    if (this.props.token !== undefined && this.props.token !== null) {
      this.props.getASNTS(this.props.token, this.props.username, this.props.match.params.id);
      this.props.getCourseDetail(this.props.token, this.props.match.params.id);
      this.props.checkTA(this.props.token, this.props.match.params.id, this.props.username);
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.token !== this.props.token) {
      if (newProps.token !== undefined && newProps.token !== null) {
        this.props.getCourseDetail(newProps.token, this.props.match.params.id);
        this.props.getASNTS(newProps.token, newProps.username, newProps.match.params.id);
        this.props.checkTA(this.props.token, this.props.match.params.id, this.props.username);
      }
    }
  }

  componentWillUnmount() {
    if (this.props.token !== undefined && this.props.token !== null) {
      this.props = {};
    }
  }

  // componentDidUpdate(prevProps) {
  //   console.log("Updated Course Details");
  //   console.log("previous props ", prevProps);
  //   if (this.props.assignments !== prevProps.assignments) {
  //     console.log("Updated Course Details");
  //     this.props.getASNTS(this.props.token, this.props.username, this.props.currentCourse.id);
  //     this.props.getCourseDetail(this.props.token, this.props.match.params.id);
  //   }
  //   console.log("New assignments ", this.props.assignments)
  // }

  renderToDoItem(item) {
    if(item){
      deadline_dict[item.title] = item.deadline.split(" ")[0]
    }
    mark.push(item.deadline.split(" ")[0])
    return (
      <Hoc>
      {(time_remng(item.deadline ,  new Date().toLocaleString()) ?
        <div>
        <Link to={`/courses/${this.props.match.params.id}/assignments/${item.id}`}>
        <List.Item>{
         <p style={{ color: 'blue' }}><FileTwoTone /> {item.title} </p> 
        // (item.deadline > new Date().toLocaleString() ? <h1 style={{ color: 'blue' }}> {item.title} </h1> : null)
      }</List.Item>
      </Link>
      </div>
      : null)}
      </Hoc>
      );
  }
  
  renderOverItem(item) {
    return (
      <Hoc>
      {!(time_remng(item.deadline ,  new Date().toLocaleString()) ?
        <div>
        <Link to={`/assignments/${item.id}`}>
        <List.Item>{
         <p style={{ color: 'red' }}><FileTwoTone /> { item.title } </p> 
       }</List.Item>
       </Link>
       </div>
       : null)}
      </Hoc>
      );
  }

  renderOverFeedItem(item) {
    return (
      <Hoc>
      {!(time_remng(item.deadline ,  new Date().toLocaleString()) && !item.is_graded  ?
        <div>
        <Link to={`/assignments/${item.id}`}>
        <List.Item>{
         <p style={{ color: 'red' }}><FileTwoTone /> { item.title } </p> 
       }</List.Item>
       </Link>
       </div>
       : null)}
      </Hoc>
      );
  }

  renderGradedItem(item) {
    return (
      <Hoc>
      {!(time_remng(item.deadline ,  new Date().toLocaleString()) && item.is_graded ?
        <div>
        <Link to={`/assignments/${item.id}`}>
        <List.Item>{
         <p style={{ color: 'green' }}><FileTwoTone /> { item.title } </p> 
       }</List.Item>
       </Link>
       </div>
       : null)}
      </Hoc>
      );
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  };

  wrappedGetCourseDetail = (oldDispatch) => {
    console.log("wrapped get course detail ", oldDispatch);
    return this.props.getCourseDetail(this.props.token, this.props.match.params.id);
  };

  wrappedGetASNTS = (oldDispatch) => {
    console.log("wrapped get asnts ", oldDispatch);
    return this.props.getASNTS(this.props.token, this.props.username, this.props.match.params.id);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const asnt = {
          teacher: this.props.username,
          title: values.title,
          problemStatement: values.problemStatement,
          weightage: values.weightage,
          course: this.props.currentCourse,
          deadline: values.deadline
        };
        // console.log("here");
        // console.log(values.deadline.local().format('DD/MM/YYYY HH:mm:ss'))
        

        var dispatch = this.props.createASNT(this.props.token, asnt);
        var dispatch1 = this.wrappedGetCourseDetail(dispatch);
        var dispatch2 = this.wrappedGetASNTS(dispatch1);  
        console.log("okay2")
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

  showCreateForm (event) {
    event.preventDefault();
    this.setState(prevstate =>({
      showCreateForm: !prevstate.showCreateForm, 
    }));
  }


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
    console.log(this.props)
    
    // var boolean = localStorage.getItem("tachecker")
    // var tacheck = false
    // { this.assignBool(boolean,tacheck) }
    // console.log("Boolean: ", boolean)
    // console.log("Tacheck: ", tacheck)


    return (
      <div>
      <Hoc>
      {this.props.loading ? (
        <Skeleton active />
        ) : (

        <Hoc>
        <h3 style={{ margin: "16px 0" }}><EditOutlined /> To-Do Assignment</h3>
        <List 
            //  displays the list of assignments
            size="large"
            bordered
            dataSource={this.props.assignments}
            renderItem={item => this.renderToDoItem(item)}
            />
            {this.props.is_student ? (<div>
              <h3 style={{ margin: "16px 0" }}>Overdue Assignment</h3>
              <List 
            //  displays the list of assignments
            size="large"
            bordered
            dataSource={this.props.assignments}
            renderItem={item => this.renderOverItem(item)}
            />
            </div>):

            // else \
            ( <div>
              <h3 style={{ margin: "16px 0" }}>Overdue Feedback</h3>
              <List 
              //  displays the list of assignments
              size="large"
              bordered
              dataSource={this.props.assignments}
              renderItem={item => this.renderOverFeedItem(item)}
              />
              <h3 style={{ margin: "16px 0" }}>Graded Assignment</h3>
              <List 
              //  displays the list of assignments
              size="large"
              bordered
              dataSource={this.props.assignments}
              renderItem={item => this.renderGradedItem(item)}
              />    
              </div>) }
            </Hoc>
            )}
        </Hoc>

        {/* { this.checkTA(this.props.token,this.props.currentCourse.id,this.props.username) } */}
        { this.props.is_teacher || (this.props.permission.make_asnts && this.props.is_ta) ? (
          <Hoc> 
          <div>
            <br />
            <br />
            <Button type="primary" shape="round" onClick={this.showCreateForm} >
              
            
            {this.state.showCreateForm ?  <UpCircleTwoTone /> : <DownCircleTwoTone /> } Create Assignment
            </Button>

            { this.state.showCreateForm
            ? <Hoc>
            <br/>
          <h1><FileAddOutlined /> Create an assignment</h1>
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

          <FormItem label={"Weightage: "}>
          {getFieldDecorator(`weightage`, {
            validateTrigger: ["onChange", "onBlur"],
            rules: [
            {
              required: true,
              message: "Please input a the weightage"
            }
            ]
          })(<Input placeholder="Enter the weightage" />)}
          </FormItem>
          
          {/* <ClockCircleOutlined /> */}
          <FormItem label={"Deadline: "}>
          {getFieldDecorator(`deadline`, {
                  // validateTrigger: ["onChange", "onBlur"],
                  rules: [
                  {
                    required: true,
                    message: "Please select date"
                  }
                  ]
                })(<DatePicker format="DD/MM/YYYY HH:mm:ss"
                disabledDate={disabledDate}
                disabledTime={disabledDateTime}
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />)}
                </FormItem>

                <FormItem>
                <Button type="primary" htmlType="submit">
                Submit
                </Button>
                </FormItem>
                </Form>
                </Hoc>
              : null }
              </div>      

                </Hoc>
                ) : (null) }

                  <div className = "leftbox">

                  <Link to={`/courses/${this.props.match.params.id}/staff`}>

                  <List.Item>

                  <UserOutlined /> Manage Participants 
                  {/* <List.Icon name='users' /> */}
                  </List.Item>

                  </Link>

                  </div>

                <div className = "rightbox">
                  <Link to={`/courses/${this.props.match.params.id}/announcements`}>
                    <List.Item>
                    <NotificationTwoTone /> View Announcements
                    </List.Item>
                  </Link>

                </div>

                <br /> 
                <div  className = "middlebox"> 
                  <Link to={`/courses/${this.props.match.params.id}/grades/`}>
                  <TrophyTwoTone /> View Grades
                  </Link>
                </div>

        <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />


       </div>
       );
  }

}

const WrappedCourseDetail = Form.create()(CourseDetail)

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    currentCourse: state.courses.currentCourse,
    loading: state.assignments.loading,
    is_student: state.auth.is_student,
    username: state.auth.username,
    is_teacher: state.auth.is_teacher,
    title: state.auth.title,
    assignments: state.assignments.assignments,
    permission: state.courses.permission,
    is_ta: state.auth.is_ta
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCourseDetail: (token, id) => dispatch(getCourseDetail(token, id)),
    createASNT: (token, asnt) => dispatch(createASNT(token, asnt)),
    getASNTS: (token, username, currentCourseId) => dispatch(getASNTS(token, username, currentCourseId)),
    checkTA: (token, courseId, username) => dispatch(checkTA(token, courseId, username)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(WrappedCourseDetail);

// export default AssignmentDetail;