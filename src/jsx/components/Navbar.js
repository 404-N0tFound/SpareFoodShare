import { Component } from "react";
import "./Navbar.css";

class Navbar extends Component {
    render() {
        return (
        <div className="Navbar">
                <div className="header">
                    <div className="Website Logo">
                        <a href='./'>
                            <h1 className="nav-header">Spare Food Share</h1>
                        </a>
                    </div>
                    <div className="links-list">
                        <ul>
                            <a href="./item">Login</a>
                            <a href="./browse">Browse</a>
                            <a></a>
                        </ul>
                    </div>
                </div>
                <hr className="navbar-line" />
            </div>
            );
    }
}

export default Navbar;
