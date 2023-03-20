import {useContext} from "react";
import "./ProfileFramework.css";
import AuthContext from "../AuthContext";

function ProfileFramework () {
    let {logoutUser} = useContext(AuthContext)

    return (
        <div className="page-content">
            <div className="sidebar">
                <div>
                    <a href='../profile'>
                        My Profile
                    </a>
                </div>
                <div>
                    <a>
                        Items
                    </a>
                </div>
                <div>
                    <a href='../profile/orders'>
                        Orders
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
