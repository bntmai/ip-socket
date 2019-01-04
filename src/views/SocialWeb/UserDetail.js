import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';

import usersData from './UsersData'

class User extends Component {

  render() {

    const user = usersData.find( user => user.id.toString() === this.props.match.params.id)

    const userDetails = user ? Object.entries(user) : [['id', (<span><i className="text-muted icon-ban"></i> Not found</span>)]]

    console.log(userDetails);

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
                    <img className="img-avatar" src="assets/img/avatars/4.jpg" alt="admin@bootstrapmaster.com"></img>
                  </div>
                  <dl className="row">
                    <dt className="col-sm-3">Email:</dt>
                    <dd className="col-sm-9">ngocthanhmai@gmail.com</dd>
                    <dt className="col-sm-3">Birthday</dt>
                    <dd className="col-sm-9">September 11, 1997</dd>
                  </dl>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default User;
