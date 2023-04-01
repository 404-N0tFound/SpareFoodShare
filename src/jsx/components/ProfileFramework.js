import {useContext} from "react";
import "./ProfileFramework.css";
import AuthContext from "../AuthContext";

function ProfileFramework() {
    let {logoutUser} = useContext(AuthContext)

    return (
        <div className="sidebar">
            <div className="sidebar-text">
                <a href='../profile'>My Profile</a>
            </div>
            <div className="sidebar-text">
                <a href='../profile/myitems'>My Items</a>
            </div>
            <div className="sidebar-text">
                <a href='../profile/orders'>My Orders</a>
            </div>
            <div className="sidebar-text">
                <a href='../profile/sales'>My Sales</a>
            </div>
            <div className="sidebar-text">
                <a href='../profile/upload'>Upload</a>
            </div>
            <div className="sidebar-text">
                <a onClick={logoutUser} href={'../login'}>Log Out</a>
            </div>
        </div>
    );
}

export default ProfileFramework;
