import React, { Component } from 'react';
import { Badge, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import Users from './Users'

function UserRow(props) {
    const user = props.user

    const getBadge = (status) => {
        return status === 'Active' ? 'success' :
            status === 'Inactive' ? 'secondary' :
                status === 'Pending' ? 'warning' :
                    status === 'Banned' ? 'danger' :
                        'primary'
    }

    return (
        <tr key={user.id.toString()}>
            <th scope="row">{user.id}</th>
            <td>{user.name}</td>
            <td>><Badge color={getBadge(user.status)}>{user.status}</Badge></td>
        </tr>
    )
}
class ChatApp extends Component {

    constructor() {
        super()
        this.state = {
            messages: []
        }
    }
    
    render() {
        const userNameList = localStorage.getItem("userNameList")
        return (
            <div className="app">
                <div>
                    <MessageList messages={this.state.messages} />
                    <SendMessageForm />
                </div>
                <Table responsive hover>
                    <tbody>
                        {userNameList.map((user, index) =>
                            <UserRow key={index} user={user} />
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
        this.props.sendMessage(window.localStorage.getItem("email"), window.localStorge.getItem("chatEmail"), this.state.message)
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

export default ChatApp;