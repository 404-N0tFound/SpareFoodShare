import { Component } from "react";
import "./Navbar.css";

class Navbar extends Component {
    render() {
        return (
        <div className="navbar">
                <div className="header">
                    <div className="website-logo">
                        <a href='../'>
                            <h1 className="nav-header">Spare Food Share</h1>
                        </a>
                    </div>
                    <div className="links-list">
                        <ul>
                            <a href="./browse" >Browse</a>
                            <a href="./item" className="Login-a">Login</a>
                        </ul>
                    </div>
                </div>
            </div>
            );
    }
}

export default Navbar;
