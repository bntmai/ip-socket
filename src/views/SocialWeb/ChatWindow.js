import React, { Component } from 'react';
import { Badge, Table, Row, Label, Button } from 'reactstrap';

import { Link } from 'react-router-dom';


function UserRow(props) {
    const user = props.user

    const userLink = `/chat/users/${user.id}`

    return (
        <tr key={user.id.toString()}>
            <th scope="row"><Link to={userLink}>{user.id}</Link></th>
            <td><Link to={userLink}>{user.email}</Link></td>
        </tr>
    )
}



class ChatApp extends Component {
    constructor() {

        super()
        this.state = {
            messages: [],
            message: '',
            chatEmail: sessionStorage.getItem('chatEmail')
        }
        this.onButtonClick.bind(this)
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
        let chatEmail = sessionStorage.getItem("chatEmail")
        let headers = { "Content-Type": "application/json" };
        let { token } = localStorage.getItem("access_token");

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        let body = JSON.stringify({ "fromUserId": currentEmail, "toUserId": chatEmail, "content": this.state.message });
        fetch('http://127.0.0.1:5000/api/chat/sendMessages', { headers, method: "POST", body }).then(result => {
            return result.json();
        }).then(data => {
            data = this.state.message
            this.setState({
                message: '',
            })
            fetch('http://127.0.0.1:5000/api/chat/loadMessages', { headers, method: "POST", body }).then(result => {
            return result.json();
        }).then(data => {
            console.log(data.result)
            this.setState({
                messages: data.result
            })
        }).catch(data => {
            console.log(data)
            this.setState({
                messages: []
            })
        })
        })

    }
    onButtonClick(e) {
        e.stopPropagation()
        e.preventDefault()
        this.setState({
            chatEmail: e.currentTarget.innerHTML
        })
        sessionStorage.setItem("chatEmail", e.currentTarget.innerHTML)
        let currentEmail = localStorage.getItem("email")
        let chatEmail = sessionStorage.getItem("chatEmail")
        let headers = { "Content-Type": "application/json" };
        let { token } = localStorage.getItem("access_token");

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        let body = JSON.stringify({ "fromUserId": currentEmail, "toUserId": chatEmail });
        fetch('http://127.0.0.1:5000/api/chat/loadMessages', { headers, method: "POST", body }).then(result => {
            return result.json();
        }).then(data => {
            console.log(data.result)
            this.setState({
                messages: data.result
            })
        }).catch(data => {
            console.log(data)
            this.setState({
                messages: []
            })
        })
    }
    handler(data) {

        this.setState({})
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
                    <form
                        onSubmit={this.handleSubmit}
                        className="send-message-form">
                        <input
                            onChange={this.handleChange}
                            value={this.state.message}
                            placeholder="Type your message and hit ENTER"
                            type="text" />
                    </form>
                </div>

                <ul>
                    {userList.map((user, index) =>
                        <button className="btn-square" onClick={this.onButtonClick.bind(this)}>{user.email}</button>

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
            message: '',
            newMessage: ''
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
        let chatEmail = sessionStorage.getItem("chatEmail")
        let headers = { "Content-Type": "application/json" };
        let { token } = localStorage.getItem("access_token");

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        let body = JSON.stringify({ "fromUserId": currentEmail, "toUserId": chatEmail, "content": this.state.message });
        fetch('http://127.0.0.1:5000/api/chat/sendMessages', { headers, method: "POST", body }).then(result => {
            return result.json();
        }).then(data => {
            data = this.state.message
            this.setState({
                message: '',
                newMessage: data
            })
        })

    }
    handleDataChange(data) {
        console.log(data)
        this.setState({
            messages: data
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