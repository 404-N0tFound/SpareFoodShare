import "./Login.css";
import Navbar from "../components/Navbar";
import "../components/Theme.css";
import {useContext} from "react";
import "./LoginBox.css";
import "../components/Theme.css";
import AuthContext from "../AuthContext";

function Login() {
    const {loginUser} = useContext(AuthContext)

    const handleClick = (e) => {
        e.preventDefault();
        {/* change to link to the registration form */
        }
        alert("Go to registration form")
    }

    return (
        <div className="page-content">
            <Navbar/>
            <body className="login-body">
              <div className="login-box">
                  <div className="page-content">
                      <form className="form" onSubmit={loginUser}>
                          <div className="input-group">
                              <label htmlFor="email">Username</label>
                              <input name="email" placeholder="somename@gmail.com"/>
                          </div>
                          <div className="input-group">
                              <label htmlFor="password">Password</label>
                              <input type="password" name="password"/>
                          </div>
                          <button className="login">Sign In</button>
                      </form>
                      <button className="register" onClick={handleClick}>
                          Register
                      </button>
                  </div>
              </div>
            </body>
        </div>
    );
}

export default Login;




