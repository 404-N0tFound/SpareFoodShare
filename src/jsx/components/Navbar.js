import "./Navbar.css";
import {useContext} from "react";
import AuthContext from "../AuthContext";

function Navbar () {
    let {user} = useContext(AuthContext)
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
                            {user ? (
                                <a href="../profile" className="login-a">My Profile</a>
                            ) : (
                                <a href="../login" className="login-a">Login</a>
                            ) }
                            <a href="../browse" className="browse-a">Browse</a>
                        </ul>
                    </div>
                </div>
            </div>
        );
}

export default Navbar;
