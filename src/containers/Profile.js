import React from "react";
import { List, Skeleton } from "antd";
import { connect } from "react-redux";
import Result from "../components/Result";
import Hoc from "../hoc/hoc";
import axios from "axios";
import { Link } from "react-router-dom";

import { Redirect } from "react-router-dom";

class Profile extends React.PureComponent {
  state = {
    email: null,
  }
  componentDidMount() {

    console.log(this.props)
    if (this.props.token !== undefined && this.props.token !== null) {
      // this.props.getGradedASNTS(this.props.username, this.props.token);

      // axios.defaults.headers = {
      //   "Content-Type": "application/json",
      //   Authorization: `Token ${this.props.token}`
      // };
      // axios
      //   .get(`http://127.0.0.1:8000/users/${this.props.userId}`)
      //   .then(res => {
      //     const user = res.data;
      //     console.log(res.data)
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   });
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.token !== this.props.token) {
      if (newProps.token !== undefined && newProps.token !== null) {
        // this.props.getGradedASNTS(newProps.username, newProps.token);
        // console.log(this.state.auth.token)
        // axios.defaults.headers = {
        //   "Content-Type": "application/json",
        //   Authorization: `Token ${this.props.token}`
        // };
        // axios
        //   .get(`http://127.0.0.1:8000/users/${this.props.userId}`)
        //   .then(res => {
        //     const user = res.data;
        //     console.log(res.data)
        //   })
        //   .catch(err => {
        //     console.log(err)
        //   });
      }
    }
  }

  // getuserdetail(userID, token) {
  //   // email = null
  //   axios.defaults.headers = {
  //     "Content-Type": "application/json",
  //     Authorization: `Token ${token}`
  //   };
  //   axios
  //     .get(`http://127.0.0.1:8000/users/${userID}`)
  //     .then(res => {
  //       const user = res.data;
  //       console.log(res.data.email)
  //       const email = res.data.email
  //       localStorage.setItem("email", res.data.email)
  //       // email = res.data['email']
  //       console.log('newfunc')
  //     })
  //     .catch(err => {
  //       // console.log(err)
  //     });

  //   // return email;
  // }

  handleUpdateEmail = (e) => {
    // let newEmail = e.target.email
    // console.log(newEmail)
    // console.log("here1")
    e.preventDefault();
    console.log(e.target[0].value)
    localStorage.setItem("email", e.target[0].value)
  }

  handleUpdatePassword = (e) => {
    console.log(e.target[0].value);
  }

  render() {
    if(this.props.token == null || this.props.token == undefined) {
      return (<Redirect to="/login" />);
    }
    // this.getuserdetail(this.props.userId, this.props.token);
    return (

      // details, update option
      <div>
        <h1>Username : {this.props.username}</h1>
        <h1>Email : {this.props.email}</h1>
        {/* 
        <form onSubmit={this.handleUpdatePassword}>
          <label> Old Password for confirmation: </label>
          <input type="text"
            name="password_old" />
          <label> New Password : </label>
          <input type="text"
            name="password_new" />
          <input type="submit" />
        </form>
        <br></br>
        <form onSubmit={this.handleUpdateEmail}>
          <label> Update Email: </label>
          <input type="text"
            refs="email"
            name="Update Email: " />
          <input type="submit" /> */}

        {/* </form> */}


        <Link to={`/profile/${this.props.userId}/update_password`}>
          <List.Item>Update Password</List.Item>
        </Link>

      </div>
      // <Hoc>
      //   {this.props.loading ? (
      //     <Skeleton active />
      //   ) : (
      //     <Hoc>
      //       <h1>Hi {this.props.username}</h1>
      //       <List
      //         size="large"
      //         // dataSource={this.props.gradedAssignments}
      //         renderItem={a => <Result key={a.id} grade={a.grade} />}
      //       />
      //     </Hoc>
      //   )}
      // </Hoc>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    username: state.auth.username,
    email: state.auth.email,
    userId: state.auth.userId,
    // gradedAssignments: state.gradedAssignments.assignments,
    // loading: state.gradedAssignments.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // getGradedASNTS: (username, token) =>
    // dispatch(getGradedASNTS(username, token))
    // updateProfile
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
