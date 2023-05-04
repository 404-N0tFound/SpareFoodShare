import "../components/Theme.css";
import "./LiveChat.css";
import ProfileFramework from "../components/ProfileFramework";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {PureComponent} from "react";
import {useLocation} from "react-router-dom";
import PropTypes from "prop-types";
import AuthContext from "../AuthContext";

class LiveChatRender extends PureComponent {
    static contextType = AuthContext;

    ws = null;
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
    }



    async componentDidMount() {
        const {chatId} = this.props.location.state;
        let response = await fetch(`http://127.0.0.1:8000/api/chats/messages/?room=${chatId}`, {
            method: 'GET'
        })
        let data = await response.json()
        if (response.status === 200) {
            this.setState({
                messages: [...this.state.messages, ...data]
            })
        }
        this.ws = new WebSocket(`ws://127.0.0.1:8000/ws/${chatId}/`);
        this.ws.addEventListener('message', this.onMessage);
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    componentWillUnmount() {
        this.ws.removeEventListener('message', this.onMessage);
        this.ws.close();
    }

    sendMessage = (e) => {
        e.preventDefault();
        const jwt = JSON.parse(localStorage.getItem('authTokens')).access;
        const { chatId } = this.props.location.state;
        this.ws.send(JSON.stringify({
            'message': e.target.messageInput.value,
            'jwt': jwt,
            'ChatRoom': chatId
        }))
        e.target.messageInput.value = "";
    }

    onMessage = (event) => {
        const message = JSON.parse(event.data);
        console.log(event.data)
        this.setState({ messages: [...this.state.messages, message] });
    };

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    render() {
        const {user} = this.context;
        return (
            <div className="page-content">
                <Navbar/>
                <body className="live-chat-body">
                <ProfileFramework />
                <div className="live-chat-list">
                    <div className="messages">
                        {this.state.messages.map((item, index) => (
                            <div key={index} className="single_message">
                                <p className="message_author">{item.username}</p>
                                <p className="message_content">{item.message}</p>
                            </div>
                        ))}
                        {this.state.messages.length === 0 &&
                            <div className="no_messages">
                                <p>Be the first to message! There are currently no messages.</p>
                            </div>
                        }
                        <div style={{ float:"left", clear: "both" }}
                             ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </div>
                    {!user.is_admin ?
                    <form onSubmit={this.sendMessage}>
                        <input type="text" className="messageInput" id="messageInput" name="messageInput" />
                        <button id="submit" className="submit-message" name="Send">Send</button>
                    </form>
                    : null}
                </div>
                </body>
                <Footer id="foot_id"/>
            </div>
        );
    }

}

LiveChatRender.propTypes = {
    location: PropTypes.node.isRequired,
};

export default function LiveChat(props) {
    const location = useLocation();
    return <LiveChatRender {...props} location={location} />;
}