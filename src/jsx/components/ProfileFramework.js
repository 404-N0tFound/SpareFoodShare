import {useContext} from "react";
import "./ProfileFramework.css";
import AuthContext from "../AuthContext";

function ProfileFramework() {
    let {logoutUser, user} = useContext(AuthContext)

    return (
        <div className="sidebar">
            <div className="sidebar-text">
                <a href='../profile'>Profile</a>
            </div>
            <div className="sidebar-text">
                <a href='../profile/myitems'>Items</a>
            </div>
            {!user.is_admin ?
            <div className="sidebar-text">
                <a href='../profile/orders'>Collected Items</a>
            </div>
            : null}
            {!user.is_admin ?
            <div className="sidebar-text">
                <a href='../profile/sales'>Shared Items</a>
            </div>
            : null}
            <div className="sidebar-text">
                <a href='../profile/chats'>Chats</a>
            </div>
            {user.is_admin ?
            <div className="sidebar-text">
                <a href='../profile/admin'>Admin Stats</a>
            </div>
            : null}
            {!user.is_admin ?
            <div className="sidebar-text">
                <a href='../profile/upload'>Upload</a>
            </div>
            : null}
            <div className="sidebar-text">
                <a onClick={logoutUser} href={'../login'}>Log Out</a>
            </div>
        </div>
    );
}

export default ProfileFramework;
