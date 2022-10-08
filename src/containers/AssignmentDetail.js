import React from "react";
import { connect } from "react-redux";
import { Card, Skeleton, message, Button , Radio } from "antd";

import 'antd/dist/antd.css';
import { Link, Redirect } from "react-router-dom"

import { DownloadOutlined, SearchOutlined, PlayCircleFilled } from '@ant-design/icons';
import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import Questions from "./Questions";
import Choices from "../components/Choices";
import { getASNTSDetail, handlePDFDownload, handleAllDownload, handleGrades, handleFeedback, timeDiffCalc ,time_remng } from "../store/actions/assignments";
// import { getASNTSDetail, handlePDFDownload, handleAllDownload,  } from "../store/actions/assignments";
// import { createGradedASNT } from "../store/actions/gradedAssignments";
import Hoc from "../hoc/hoc";

import axios from "axios";


const cardStyle = {
  marginTop: "20px",
  marginBottom: "20px"
};

class AssignmentDetail extends React.Component {
  state = {
    username: '',
    token: '',
    currentAssignment: '',
    loading: true,
    submissionFile: null,
    is_student: true,
    title: '',
    feedbackInfo: {},
    curTime: new Date().toLocaleString(),
  };

  componentDidMount() {
    setInterval(() => {
      this.setState({
        curTime : new Date().toLocaleString()
      })
    }, 1000)
    if (this.props.token !== undefined && this.props.token !== null) {
      this.props.getASNTSDetail(this.props.token, this.props.match.params.id);
      if(this.props.is_student) {
        this.props.handleFeedback(this.props.token, this.props.username, this.props.match.params.id);
      }
    }
  }

  componentWillUnmount() {
    console.log("Will unmount");
    this.props = {};
  }

  componentWillReceiveProps(newProps) {
    if (newProps.token !== this.props.token) {
      if (newProps.token !== undefined && newProps.token !== null) {
        this.props.getASNTSDetail(newProps.token, this.props.match.params.id);

        if(this.props.is_student) {
          this.props.handleFeedback(newProps.token, newProps.username, this.props.match.params.id);
        }
      }
    }
  }

  // onChange = (e, qId) => {
  //   const { usersAnswers } = this.state;
  //   usersAnswers[qId] = e.target.value;
  //   this.setState({ usersAnswers });
  // };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  };

  handleFileChange = (e) => {
    this.setState({
      submissionFile: e.target.files[0]
    })
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let form_data = new FormData();
    var time_rem = time_remng(this.props.currentAssignment.deadline,this.state.curTime);

    form_data.append('submissionfile', this.state.submissionFile, this.state.submissionFile.name);
    form_data.append('username', this.props.username);
    form_data.append('currentAssignment', this.props.match.params.id);
    form_data.append('time_rem',time_rem);
    // console.log("The ID", this.props.currentAssignment.id);

    let url = 'http://127.0.0.1:8000/assignments/posts/';

    axios.post(url, form_data, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.log(err));
  };

  gradeNow = (e) => {
    e.preventDefault();
    let form_data = new FormData();
    form_data.append('currentAssignment', this.props.match.params.id);
    let url = 'http://127.0.0.1:8000/assignments/feedback/';

    axios.post(url, form_data, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.log(err))
  };
  
  render() {
    // if(this.props.is_student && this.props.currentAssignment.id !== undefined) {
    //   handleFeedback(this.props.token, this.props.username, this.props.currentAssignment.id);
    // }
    // var info = localStorage.getItem("info");

    if(this.props.token == null || this.props.token == undefined) {
      return (<Redirect to="/login" />);
    }

    console.log("Props check ", this.props.feedbackInfo);

    var timeDiff = timeDiffCalc(this.props.currentAssignment.deadline, this.state.curTime);

    return (
      <div className="App" >
        <h1> {this.props.currentAssignment.title} </h1>

        {(this.props.is_student && time_remng(this.props.currentAssignment.deadline,this.state.curTime) ? (
          <form onSubmit={this.handleSubmit}>
            <input type="file"
              onChange={this.handleFileChange} required />

            <input type="submit" />

          </form>
        ) :null)}

        {(!this.props.is_student?(
          <div>
            <h1>Submit feedback: </h1>
            <form onSubmit={this.handleSubmit}>
              <input type="file"
                onChange={this.handleFileChange} required />
              <input type="submit" />
            </form>
          </div>): null
        )}

        {(!this.props.is_student?(
          <div>
            <br />
            <h2>Assign Grades now <PlayCircleFilled onClick={this.gradeNow} /></h2>
          </div>
          ): null
        )}

        {
          (this.props.is_student ? (
          <div> 
          <br />
          <Button type="primary" shape="round"  onClick={() => handlePDFDownload(this.props.currentAssignment.course, this.props.username, this.props.currentAssignment.title)}>
          <DownloadOutlined /> Download File!
          </Button>      
          </div> 
          ):
          <div>
            <br />
            <Button type="primary" icon={<DownloadOutlined />} shape="round" onClick={() => handleAllDownload(this.props.currentAssignment.course, this.props.currentAssignment.title)}>
            <DownloadOutlined />   Download All Submissions!
            </Button>
          </div>)
        }

        <p>Time Remaining = {timeDiff}</p>

        {
          this.props.is_student ? (
          <div>
            <h1>Feedback: </h1>
            <p>{this.props.feedbackInfo.feedback}</p>
          </div>
        ) :
          null
        }

        {
          this.props.is_student ? (
          <div>
            <h1>Grade: </h1>
            <p>{this.props.feedbackInfo.grade}</p>
          </div>
        ) :
          null
        }
        <br></br>

        {!this.props.is_student ? (
            <Link to={`/courses/${this.props.match.params.cid}/grades/${this.props.match.params.id}`}>
              View Grades
            </Link>
          ):(null)}
      </div>

    );
  }
};

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    currentAssignment: state.assignments.currentAssignment,
    loading: state.assignments.loading,
    username: state.auth.username,
    is_student: state.auth.is_student,
    title: state.auth.title,
    // deadline: state.auth.deadline
    feedbackInfo: state.assignments.feedbackInfo,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getASNTSDetail: (token, id) => dispatch(getASNTSDetail(token, id)),
    handleFeedback: (token, username, assgn_id) => dispatch(handleFeedback(token, username, assgn_id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssignmentDetail);

// export default AssignmentDetail;