import React from "react";
import { connect } from "react-redux";
import { Card, Skeleton, message } from "antd";
import Questions from "./Questions";
import Choices from "../components/Choices";
import { getAnncDetail } from "../store/actions/announcements";
import Hoc from "../hoc/hoc";

import axios from "axios";
import { Redirect } from "react-router-dom";

const cardStyle = {
    marginTop: "20px",
    marginBottom: "20px"
};

class AnnouncementDetail extends React.Component {
    state = {
        username: '',
        token: '',
        currentAnnouncement: '',
        loading: '',
        is_student: true,
        title: '',
    };

    componentDidMount() {
        if (this.props.token !== undefined && this.props.token !== null) {
            this.props.getAnncDetail(this.props.token, this.props.match.params.id);
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.token !== this.props.token) {
            if (newProps.token !== undefined && newProps.token !== null) {
                this.props.getAnncDetail(newProps.token, this.props.match.params.id);
            }
        }
    }

    render() {
        if(this.props.token == null || this.props.token == undefined) {
            return (<Redirect to="/login" />);
        }
        return (
            <div>
                <p>{this.props.currentAnnouncement.message}</p>
            </div>

        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        currentAnnouncement: state.announcements.currentAnnouncement,
        loading: state.assignments.loading,
        username: state.auth.username,
        is_student: state.auth.is_student,
        title: state.auth.title,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAnncDetail: (token, id) => dispatch(getAnncDetail(token, id)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AnnouncementDetail);