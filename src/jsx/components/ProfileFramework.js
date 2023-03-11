import { Component } from "react";
import "./ProfileFramework.css";
import Navbar from "./Navbar";

class ProfileFramework extends Component {
    render() {
        return (
            <div className="page-content">
                <Navbar />
                <div className="sidebar">
                    <div>
                        <a href='../profile'>
                            My Profile
                        </a>
                    </div>
                    <div>
                        <a>
                            Upload
                        </a>
                    </div>
                    <div>
                        <a>
                            Logout
                        </a>
                    </div>
                </div>

                <div className="page-value">
                    
                </div>
            </div>
        );
    }
}

export default ProfileFramework;
