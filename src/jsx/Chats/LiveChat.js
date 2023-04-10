/* eslint-disable */
import "../components/Theme.css";
import "./LiveChat.css";
import ProfileFramework from "../components/ProfileFramework";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {PureComponent} from "react";
import jwtDecode from "jwt-decode";
import {useLocation, useNavigate} from "react-router-dom";

class LiveChatRender extends PureComponent {
    ws = null;
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
    }

    componentDidMount() {
        const { chatId } = this.props.location.state;
        this.ws = new WebSocket(`ws://127.0.0.1:8000/ws/${chatId}/`);
        this.ws.addEventListener('message', this.onMessage);
    }

    componentWillUnmount() {
        this.ws.removeEventListener('message', this.onMessage);
        this.ws.close();
    }

    sendMessage = (e) => {
        e.preventDefault();
        const user_id = (jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access).user_id).toString();
        const { chatId } = this.props.location.state;
        this.ws.send(JSON.stringify({
            'message': e.target.messageInput.value,
            'user_id': user_id,
            'ChatRoom': chatId
        }))
        e.target.messageInput.value = "";
    }

    onMessage = (event) => {
        const message = JSON.parse(event.data);
        this.setState({ messages: [...this.state.messages, message] });
    };

    render() {
        return (
            <div className="page-content">
                <Navbar/>
                <body className="live-chat-body">
                <ProfileFramework />
                <div className="live-chat-list">
                    <div className="messages">
                        {this.state.messages.map((item, index) => (
                            <div key={index} className="single_message">
                                <p className="message_author">{item.user_id}</p>
                                <p className="message_content">{item.message}</p>
                            </div>
                        ))}
                        {this.state.messages.length === 0 &&
                            <div className="no_messages">
                                <p>Be the first to message! There are currently no messages.</p>
                            </div>
                        }
                    </div>
                    <form onSubmit={this.sendMessage}>
                        <input type="text" className="messageInput" id="messageInput" name="messageInput" />
                        <button id="submit" className="submit-message" name="Send">Send</button>
                    </form>
                </div>
                </body>
                <Footer id="foot_id"/>
            </div>
        );
    }

}

export default function LiveChat(props) {
    const location = useLocation();
    return <LiveChatRender {...props} location={location} />;
}