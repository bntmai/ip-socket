import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, CardBody, CardHeader, Col, Row, Table, FormGroup, Label, Input, Button, Form } from 'reactstrap';
import { users } from "../../actions";
import usersData from './UsersData'
import { connect } from "react-redux";

function onSubmitFriendRequest(user) {
  let headers = { "Content-Type": "application/json" };
  let { token } = localStorage.getItem("access_token");

  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }
  let userId = localStorage.getItem("id");
  let body = JSON.stringify({ "userId": userId, "friendId": user.id });
  console.log(body);
  fetch('http://127.0.0.1:5000/api/add-friends/', { headers, method: "POST", body }).then(result => {
    return result.json();
  }).then(data => {
    // window.location.reload();
  })
}

function RequestButton(props) {
  const user = props.user
  const userLink = `/add-friends/${user.id}`
  if (user.relation == 'GUEST') {
    return (
      <div><Button block color="primary" onClick={() => onSubmitFriendRequest(user)}>Add Friend</Button></div>
    )
  }
  else {
    return (
      <div></div>
    )
  }
}

function UserRow(props) {
  const user = props.user

  const userLink = `/home/users/${user.id}`

  const getBadge = (status) => {
    return status === 'Active' ? 'success' :
      status === 'Inactive' ? 'secondary' :
        status === 'Pending' ? 'warning' :
          status === 'Banned' ? 'danger' :
            'primary'
  }

  return (
    <tr key={user.id.toString()}>
      <th scope="row"><Link to={userLink}>{user.id}</Link></th>
      <td><Link to={userLink}>{user.email}</Link></td>
      <td>{user.dob}</td>
      <td>{user.relation}</td>
      <td><RequestButton user={user}></RequestButton></td>
    </tr>
  )
}

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      searchString: ""
    };
    this.getUserList();
  }
  onSubmit = e => {
    e.preventDefault();
    let headers = { "Content-Type": "application/json" };
    let { token } = localStorage.getItem("access_token");

    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }
    let searchString = this.state.searchString;
    let body = JSON.stringify({ "userId": localStorage.getItem("id"), "searchString": searchString });
    fetch('http://127.0.0.1:5000/api/find-friends/', { headers, method: "POST", body }).then(result => {
      return result.json();
    }).then(data => {
      this.setState({
        data: data,
      })
    })
  }
  getUserList() {
    let headers = { "Content-Type": "application/json" };
    let { token } = localStorage.getItem("access_token");

    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }
    let userId = localStorage.getItem("id");
    let body = JSON.stringify({ "userId": userId });
    fetch('http://127.0.0.1:5000/api/users/', { headers, method: "POST", body }).then(result => {
      return result.json();
    }).then(data => {
      this.setState({
        data: data,
      })
    })
  }
  componentDidMount() {
    this.getUserList();
  }

  render() {
    // const userList = usersData.filter((user) => user.id < 10)
    // var data = JSON.parse(this.state.data.result);
    const userList = []

    const data = this.state.data.result;
    for (var item in data) {
      console.log(data[item]);
      userList.push(data[item]);
    }
    localStorage.setItem("userList", JSON.stringify(userList));
    console.log(localStorage.getItem("userList"))
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-search"></i> Search for users
              </CardHeader>
              <CardBody>
                <Form method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.onSubmit}>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Input name or email:</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" placeholder="Text" onChange={e => this.setState({ searchString: e.target.value })}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="10">
                    </Col>
                    <Col xs="12" md="2">
                      <Button block color="primary" type="submit">Search</Button>
                    </Col>
                  </FormGroup>
                </Form>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col">id</th>
                      <th scope="col">name</th>
                      <th scope="col">DOB</th>
                      <th scope="col">Friends</th>
                      <th scope="col">Request</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user, index) =>
                      <UserRow key={index} user={user} />
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchUsers: () => dispatch(users.fetchUsers()),
  };
}

export default connect(null, mapDispatchToProps)(Users);