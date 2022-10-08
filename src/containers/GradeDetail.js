import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Card, Skeleton, message, Button , Radio } from "antd";
import 'antd/dist/antd.css';
import { getAssignmentStats } from "../store/actions/grades";
import * as actions from "../store/actions/grades"

import { Redirect } from "react-router-dom";

import { 
         ComposedChart,
         Bar,
         Cell,
         XAxis,
         YAxis,
         CartesianGrid,
         Tooltip,
         Legend,
         ResponsiveContainer
       } from 'recharts';

const cardStyle = {
  marginTop: "20px",
  marginBottom: "20px"
};

class GradeDetail extends React.Component {
  componentDidMount() {
    if (this.props.token !== undefined && this.props.token !== null) {
      this.props.getAssignmentStats(this.props.token, this.props.match.params.id, this.props.match.params.assignment_id);
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.token !== this.props.token) {
      if (newProps.token !== undefined && newProps.token !== null) {
        this.props.getAssignmentStats(this.props.token, this.props.match.params.id, this.props.match.params.assignment_id);
      }
    }
  }

  render() {
    if(this.props.token == null || this.props.token == undefined) {
      return (<Redirect to="/login" />);
    }
    
    if(this.props.stats !== null && this.props.stats !== undefined && this.props.stats.length !== 0) {
      const mean = this.props.stats.mean;
      const variance = this.props.stats.variance;
      const marks_list = this.props.stats.marks_list;

      const num_bins = 10;
      // Here the histogram will be based upon percentage scores


      const hist = [];
      for(var i = 0; i < 11; i++) {
        hist.push({
          num: 0,
          marks: `${i*10}-${(i+1)*10}`
        })
      }

      for(const marks of marks_list) {
        var bin = parseInt(marks/10);
        hist[bin].num++;
      }

      return (
        <div>
          <h2>Assignment {this.props.currentAssignment.title} statistics</h2>
          <ResponsiveContainer width="50%" aspect={1}>
            <ComposedChart
              width={200}
              height={200}
              data={hist}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="marks" scale="band" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="num" fill="#8884d8" />
            </ComposedChart>
          </ResponsiveContainer>
          <h3>Mean : {(this.props.stats.mean).toFixed(2)}</h3>
          <h3>Variance : {(this.props.stats.variance).toFixed(2)}</h3>
        </div>
      );
    }
    else {
      return (<h2>Assignment {this.props.currentAssignment.title} statistics</h2>);
    }
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    currentAssignment: state.assignments.currentAssignment,
    loading: state.assignments.loading,
    username: state.auth.username,
    is_student: state.auth.is_student,
    title: state.auth.title,
    stats: state.grades.stats
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAssignmentStats: (token, course_id, assignment_id) => dispatch(getAssignmentStats(token, course_id, assignment_id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GradeDetail);