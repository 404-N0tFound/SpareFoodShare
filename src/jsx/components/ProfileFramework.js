import {useContext} from "react";
import "./ProfileFramework.css";
import Navbar from "./Navbar";
import AuthContext from "../AuthContext";

function ProfileFramework () {
    let {logoutUser} = useContext(AuthContext)

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
                    <a onClick={logoutUser} href={'../login'}>
                        Logout
                    </a>
                </div>
            </div>

            <div className="page-value">

            </div>
        </div>
    );
}

export default ProfileFramework;
