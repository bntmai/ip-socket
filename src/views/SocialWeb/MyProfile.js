import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blogs: ""
        };
        this.getBlogs();
    }
    getBlogs() {
        let headers = { "Content-Type": "application/json" };
        let { token } = localStorage.getItem("access_token");

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        const userId = localStorage.getItem("id");
        let body = JSON.stringify({ "userId": userId });
        fetch('http://127.0.0.1:5000/api/blogs/', { headers, method: "POST", body }).then(result => {
            return result.json();
        }).then(data => {
            this.setState({
                blogs: data,
            })
        })
    }
    componentDidMount() {
        this.getBlogs();
    }

    render() {

        const id = localStorage.getItem("id");
        const email = localStorage.getItem("email");
        const dob = localStorage.getItem("dob");
        const blogList = [];
        const blogs = this.state.blogs["result"];
        for (var item in blogs) {
          blogList.push(blogs[item])
        }

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
                                        <img className="img-avatar" src="http://127.0.0.1:3000/assets/img/avatars/4.jpg" alt="admin@bootstrapmaster.com"></img>
                                    </div>
                                    <dl className="row">
                                        <dt className="col-sm-3">Email:</dt>
                                        <dd className="col-sm-9">{email}</dd>
                                        <dt className="col-sm-3">Birthday</dt>
                                        <dd className="col-sm-9">{dob}</dd>
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
                                    <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                                </CardBody>
                            </Card>
                        )}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Profile;
