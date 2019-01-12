import React, { Component } from 'react';
import { Badge, Table, Row, Label, Button } from 'reactstrap';
import { chat } from "../../actions";
import { Link } from 'react-router-dom';
import Users from './Users'
import { connect } from "react-redux";

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
            }],
            chatEmail: localStorage.getItem('chatEmail')
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.chatEmail != nextState.chatEmail;
      }
    render() {
        let userList = localStorage.getItem("userList")
        userList = JSON.parse(userList)
        console.log(userList)

        return (
            <div className="app">
                <div>

                <div className="center-label"><Label>{this.state.chatEmail}</Label></div>
                    <MessageList messages={this.state.messages} />
                    <SendMessageForm />
                </div>
                <ul>
                    {userList.map((user) =>
                      <Button block color="light" className="btn-square">{user.email}</Button> 
                    )}
                  </ul>
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
        let headers = { "Content-Type": "application/json" };
        let { token } = localStorage.getItem("access_token");

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        const userId = localStorage.getItem("id");
        let body = JSON.stringify({ "fromUserId": currentEmail, "toUserId": chatEmail, "content":  this.state.message });
        fetch('http://127.0.0.1:5000/api/chat/sendMessages', { headers, method: "POST", body }).then(result => {
            return result.json();
        }).then(data => {
            this.setState({
                message: ''
            })
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
// const mapDispatchToProps = dispatch => {
//     return {
//       sendMessage: (fromUserId, toUserId, content) => dispatch(chat.sendMessage(fromUserId, toUserId, content)),
//     };
//   }

// connect(null,mapDispatchToProps)(SendMessageForm);
export default ChatApp;  