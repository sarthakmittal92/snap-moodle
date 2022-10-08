import React from "react";
import { Layout, Menu, Breadcrumb, Button } from "antd";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../store/actions/auth";
import {
  HomeOutlined,
  HomeTwoTone,
  DashboardOutlined,
  MessageOutlined,
  PlusOutlined,
  HeartOutlined,
  HeartFilled,
  GithubFilled,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

class CustomLayout extends React.Component {

  render() {
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            style={{ lineHeight: "64px" }}
          >
            {this.props.isAuthenticated ? (
              <Menu.Item key="2" onClick={this.props.logout}>
                Logout
              </Menu.Item>
            ) : (
              <Menu.Item key="2">
                <Link to="/login">Login or Signup</Link>
              </Menu.Item>
            )}
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>
              <HomeOutlined />
              <Link to="/">    Home</Link>
            </Breadcrumb.Item>

            {this.props.token !== null ? (
              <Breadcrumb.Item>
                <DashboardOutlined />
                <Link to={`/profile/${this.props.userId}`}>  Profile</Link>
              </Breadcrumb.Item>
            ) : null}
            {this.props.token !== null ? (
              <Breadcrumb.Item>
                <MessageOutlined />
                <Link to="/messaging">  Messages</Link>
              </Breadcrumb.Item>
            ) : null}
            {this.props.token !== null && this.props.is_teacher ? (
              <Breadcrumb.Item>
                <PlusOutlined />
                <Link to="/create">  Create</Link>
              </Breadcrumb.Item>
            ) : null}
          </Breadcrumb>
          <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
            {this.props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Created   with   <HeartFilled style={{ fontSize: '32px', color: "red" }} />   by 
          <Button type="link" href="https://github.com/Sarthak0902">
            Sarthak Mittal
          </Button>
          <Button type="link" href="https://github.com/calcudexter">
            Neeraj Jadhav
          </Button>
          <Button type="link" href="https://github.com/adityajain3jan"> 
            Aditya Jain
          </Button>
          <Button type="link" href="https://github.com/Parshant-Arora">  
            Parshant Arora
          </Button>
          <Button type="link" href="https://github.com/Parshant-Arora/SNAP-moodle">

            

            <GithubFilled style={{ fontSize: '32px', color: "black" }} />
          </Button>
        </Footer>
          

      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.auth.userId,
    token: state.auth.token,
    is_teacher: state.auth.is_teacher
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(actions.logout())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CustomLayout)
);
