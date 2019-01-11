import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';

import usersData from './UsersData'

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: "",
      blogs: "",
      avatar: "http://127.0.0.1:3000/assets/img/avatars/4.jpg"
    };
    this.getUserList();
  }
  getUserList() {
    let headers = { "Content-Type": "application/json" };
    let { token } = localStorage.getItem("access_token");

    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }
    const userId = this.props.match.params.id;
    let body = JSON.stringify({ "userId": userId });
    fetch('http://127.0.0.1:5000/api/other-users/', { headers, method: "POST", body }).then(result => {
      return result.json();
    }).then(data => {
      this.setState({
        info: data,
      })
    })
    fetch('http://127.0.0.1:5000/api/blogs/', { headers, method: "POST", body }).then(result => {
      return result.json();
    }).then(data => {
      this.setState({
        blogs: data,
      })
    })
  }
  getAvatar() {
    let headers = { "Content-Type": "application/json" };
    let { token } = localStorage.getItem("access_token");

    if (token) {
        headers["Authorization"] = `Token ${token}`;
    }
    const userId = localStorage.getItem("id");
    let body = JSON.stringify({ "userId": userId });
    fetch('http://127.0.0.1:5000/api/get-images/', { headers, method: "POST", body }).then(result => {
        return result.json();
    }).then(data => {
        console.log(data.result.avatar);
        this.setState({
            avatar: "http://127.0.0.1:3000/assets/" + data.result.avatar,
        })
    })
}
  componentDidMount() {
    this.getUserList();
    this.getAvatar();
  }

  render() {


    // const userDetails = user ? Object.entries(user) : [['id', (<span><i className="text-muted icon-ban"></i> Not found</span>)]]

    console.log(this.state.info, this.state.blogs);
    const info = this.state.info["result"];
    const blogs = this.state.blogs["result"];
    const infoList = [];
    const blogList = [];
    for (var item in info) {
      infoList.push(info[item]);
    }
    for (var item in blogs) {
      blogList.push(blogs[item])
    }
    console.log(blogList);

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                {/* <strong><i className="icon-info pr-1"></i>User id: {this.props.match.params.id}</strong> */}
                <strong><i className="icon-info pr-1"></i>User information</strong>
              </CardHeader>
              <CardBody>
                <div className="bd-example">
                  <div className="avatar float-left">
                    <img className="img-avatar" src={this.state.avatar} alt="admin@bootstrapmaster.com"></img>
                  </div>
                  <dl className="row">
                    <dt className="col-sm-3">Email:</dt>
                    <dd className="col-sm-9">{infoList[1]}</dd>
                    <dt className="col-sm-3">Birthday</dt>
                    <dd className="col-sm-9">{infoList[0]}</dd>
                  </dl>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
        <Col lg={4}>
          {blogList.map((blog, index) =>
            <Card key={index}>
              <CardHeader>{blog.title}</CardHeader>
              <CardBody>
                <div dangerouslySetInnerHTML={{ __html: blog.content  }}></div>
              </CardBody>
            </Card>
          )}
        </Col>
        </Row>
      </div>
    )
  }
}

export default User;
