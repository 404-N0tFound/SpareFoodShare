import { Component } from "react";
import "./Navbar.css";

class Navbar extends Component {
    render() {
        return (
                <div className="Welcome-header">
                    <div className="Website Logo">
                        <a href="./">
                            <h1>Spare Food Share</h1>
                        </a>
                    </div>
                    <div className="links-list">
                        <ul>
                            <a href="./listings">Login(listings)</a>
                            <a>About Us</a>
                            <a href="./browse">Browse</a>
                            <a className="contact">Contact</a>
                        </ul>
                    </div>
                </div>
            );
    }
}

export default Navbar;
