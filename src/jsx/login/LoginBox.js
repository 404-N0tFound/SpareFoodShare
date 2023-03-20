import "./LoginBox.css";
import "../components/Theme.css";

import {useContext} from "react";
import AuthContext from "../AuthContext";

function LoginBox () {
    const {loginUser} = useContext(AuthContext)

    return (
        <div className="section">
            <div className="container">
                <div className="full-height">
                    <h6 className="h6 span"><span>Sign In </span><span>Register</span></h6>
                    <input type="checkbox" name="reg-log" className="checkbox" id="reg-log"/>
                    <label htmlFor="reg-log" />
                    <div className="card-3d-wrap">
                        <div className="card-3d-wrapper">
                            <div className="card-front">
                                <form onSubmit={loginUser}>
                                    <h4>Sign In</h4>
                                    <div className="form-group">
                                        <input name="email" className="form-style" placeholder="Username" autoComplete="off" />
                                    </div>
                                    <div className="form-group">
                                        <input name="password" type="password" className="form-style" placeholder="Password" autoComplete="off" />
                                    </div>
                                    <button className="button">submit</button>
                                </form>
                            </div>
                            <div className="card-back">
                                <h4>Create a new account</h4>
                                <div className="form-group">
                                    <input type="text" className="form-style" placeholder="Full Name"
                                           autoComplete="off">
                                    </input>
                                </div>
                                <div className="form-group">
                                    <input type="email" className="form-style" placeholder="Email"
                                           autoComplete="off">
                                    </input>
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-style" placeholder="Password"
                                           autoComplete="off">
                                    </input>
                                </div>
                                <a href="#" className="button">submit</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginBox;