import { Component } from "react";
import "./WelcomePageNavbar.css";

class WelcomePageNavbar extends Component {
    render() {
        return (
                <div className="Welcome-header">
                    <h1>Spare Food Share</h1>
                    <p>Login |</p>
                    <a href="./items">Click me</a>
                    <p>About Us |</p>
                    <p>Browse |</p>
                    <p>Contact</p>
                </div>
            );
    }
}

export default WelcomePageNavbar;
