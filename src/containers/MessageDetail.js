import React from "react";
import { connect } from "react-redux";
import { Card, Skeleton, message } from "antd";
import { getMsgDetail } from "../store/actions/messages";
import Hoc from "../hoc/hoc";


import { Redirect } from "react-router-dom";
import axios from "axios";

const cardStyle = {
    marginTop: "20px",
    marginBottom: "20px"
};

class MessageDetail extends React.Component {

    componentDidMount() {
        if (this.props.token !== undefined && this.props.token !== null) {
            this.props.getMsgDetail(this.props.token, this.props.match.params.id);
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.token !== this.props.token) {
            if (newProps.token !== undefined && newProps.token !== null) {
                this.props.getMsgDetail(newProps.token, this.props.match.params.id);
            }
        }
    }

    render() {
        if(this.props.token == null || this.props.token == undefined) {
            return (<Redirect to="/login" />);
          }
        return (
            <div>
                <p>{this.props.currentMessage.msg_content}</p>
            </div>

        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        currentMessage: state.messaging.currentMessage,
        loading: state.messaging.loading,
        username: state.auth.username,
        is_student: state.auth.is_student,
        title: state.auth.title,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getMsgDetail: (token, id) => dispatch(getMsgDetail(token, id)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MessageDetail);