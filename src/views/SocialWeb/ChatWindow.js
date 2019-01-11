import React, { Component } from 'react';
import { Badge, Table, Row } from 'reactstrap';
import { chat } from "../../actions";
import { Link } from 'react-router-dom';
import Users from './Users'
import { connect } from "react-redux";
function UserRow(props) {
    const user = props.user
    return (
      <tr key={user.id.toString()}>
        <td onClick={(event) => {localStorage.setItem("chatEmail", event.currentTarget.innerHTML)}}>{user.email}</td>
      </tr>
    )
  }
class ChatApp extends Component {

    constructor() {

        super()
        this.state = {
            messages: [{
                fromUserId: "perborgen",
                content: "who'll win?"
            },
            {
                fromUserId: "janedoe",
                content: "who'll win?"
            }]
        }
    }
    
    render() {
        let userList = localStorage.getItem("userList")
        userList = JSON.parse(userList)
        console.log(userList)

        return (
            <div className="app">
                <div>
                    <MessageList messages={this.state.messages} />
                    <SendMessageForm />
                </div>
                <Table responsive hover>
                  <tbody>
                    {userList.map((user, index) =>
                      <UserRow key={index} user={user}/>
                    )}
                  </tbody>
                </Table>
            </div>
        )
    }
}

class MessageList extends Component {
    render() {
        return (
            <ul className="message-list">
                {this.props.messages.map(message => {
                    return (
                        <li key={message.id} className="message">
                            <div>
                                {message.fromUserId}
                            </div>
                            <div>
                                {message.content}
                            </div>
                        </li>
                    )
                })}
            </ul>

        )
    }
}

class SendMessageForm extends Component {
    constructor() {
        super()
        this.state = {
            message: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e) {
        this.setState({
            message: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault()
        let currentEmail = localStorage.getItem("email")
        let chatEmail = localStorage.getItem("chatEmail")
        this.props.sendMessage(currentEmail, chatEmail, this.state.message)
        this.setState({
            message: ''
        })
    }

    render() {
        return (
            <form
                onSubmit={this.handleSubmit}
                className="send-message-form">
                <input
                    onChange={this.handleChange}
                    value={this.state.message}
                    placeholder="Type your message and hit ENTER"
                    type="text" />
            </form>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return {
      sendMessage: (fromUserId, toUserId, content) => dispatch(chat.sendMessage(fromUserId, toUserId, content)),
    };
  }

  export default connect(null,mapDispatchToProps)(ChatApp);