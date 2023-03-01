import { Component } from "react";
import "./Navbar.css";

class Navbar extends Component {
    render() {
        return (
                <div className="Navbar-header">
                    <div className="Website Logo">
                        <a href="../">
                            <h1>Spare Food Share</h1>
                        </a>
                    </div>
                    <div className="links-list">
                        <ul>
                            <a href="./">Home</a>
                            <a href="./browse">Profile</a>
                        </ul>
                    </div>
                </div>
            );
    }
}

export default Navbar;
