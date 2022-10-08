import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { Form, Input, Button, List, Skeleton, Alert } from "antd";
import * as grade_actions from "../store/actions/grades";
import * as course_actions from "../store/actions/courses";
import * as asnt_actions from "../store/actions/assignments";
import Hoc from "../hoc/hoc";

import {
  PieChartOutlined
} from '@ant-design/icons';

import {
  ComposedChart,
  Line,
  Bar,
  ErrorBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`Assignment : ${payload[0].payload["assignment_name"]}`}</p>
        <p className="label">{`Mean : ${payload[0].payload["mean"]}`}</p>
        <p className="label">{`Variance : ${payload[0].payload["variance"]}`}</p>
        {/*<p className="intro">{getIntroOfPage(label)}</p>
        <p className="desc">Anything you want can be displayed here.</p>*/}
      </div>
      );
    };
    return null;
  }

class GradeList extends React.PureComponent {
  componentDidMount() {
    if (this.props.token !== undefined && this.props.token !== null) {
      this.props.getGRADES(this.props.token, this.props.username, this.props.match.params.id);
      this.props.getCourseDetail(this.props.token, this.props.match.params.id);
      this.props.getCourseStats(this.props.token, this.props.match.params.id);
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.token !== this.props.token) {
      if (newProps.token !== undefined && newProps.token !== null) {
        this.props.getGRADES(this.props.token, this.props.username, this.props.match.params.id);
        this.props.getCourseDetail(newProps.token, this.props.match.params.id);
        this.props.getCourseStats(this.props.token, this.props.match.params.id);
      }
    }
  }

  renderItem(item) {
    return (
      <div>
        <List.Item>
          <br/>
          Assignment : {item.assignment}<br/>
          Feedback : {item.feedback}<br/>
          Grade : {item.grade}<br/>
          <br/>
        </List.Item>
      </div>
    );
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

    const id_to_weight = {}
    for(const asnt of this.props.assignments) {
      id_to_weight[asnt.id] = asnt.weightage;
    }

    console.log("weights ", id_to_weight);

    var courseTotal = 0;
    for (const asnt of this.props.grades) {
      courseTotal += asnt.grade*id_to_weight[asnt.assignment]/100;
    }

    var classAvg = 0;
    if(this.props.stats !== null && this.props.stats !== undefined && this.props.stats.length > 0) {
      for (const asnt of this.props.stats) {
        classAvg += asnt.mean*id_to_weight[asnt.assignment]/100;
      }
    }

    return (
      <div>
        <Hoc>
          {this.props.loading ? (
            <Skeleton active />
          ) : (
            <div>
              {
                !this.props.is_teacher ? 
                (
                  <div>
                    <h3 style={{ margin: "16px 0" }}>Grades List</h3>
                    <List
                      size="large"
                      bordered
                      dataSource={this.props.grades}
                      renderItem={item => this.renderItem(item)}
                    />
                    <br/>

                    <h4>Course Total : {courseTotal.toFixed(2)}</h4>
                    {(courseTotal < classAvg/2) ? (
                        <Alert
                          message="Warning"
                          description="Your course total is less than half of class average."
                          type="warning"
                          showIcon
                          closable
                        />
                      ) : (null)}

                  </div>
                ) : (
                    <div>
                       <h2><PieChartOutlined /> Course Statistics</h2>
                      <br />

                      <ResponsiveContainer width="65%" aspect={1}>
                        <ComposedChart
                          width={200}
                          height={200}
                          data={this.props.stats}
                          margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                          }}
                        >
                          <CartesianGrid stroke="#f5f5f5" />
                          <XAxis dataKey="assignment_name" scale="band" />
                          <YAxis />
                          {/*<Tooltip />*/}
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar dataKey="mean" barSize={20} fill="#413ea0">
                            <ErrorBar dataKey="variance" />
                          </Bar>
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                )
              }
            </div>
          )}
        </Hoc>
      </div>
    );
  }
}

const WrappedGradeUpdate = Form.create()(GradeList)

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    username: state.auth.username,
    loading: state.grades.loading,
    is_teacher: state.auth.is_teacher,
    grades: state.grades.grades,
    stats: state.grades.stats,
    assignments: state.assignments.assignments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getGRADES: (token, username, courseid) =>
      dispatch(
        grade_actions.getGRADES(token, username, courseid)
      ),
    getCourseDetail: (token, courseid) =>
      dispatch(
        course_actions.getCourseDetail(token, courseid)
      ),
    getCourseStats: (token, courseid) =>
      dispatch(
        grade_actions.getCourseStats(token, courseid)
      ),
    getASNTS: (token, username, course_id) => dispatch(asnt_actions.getASNTS(token, username, course_id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedGradeUpdate);