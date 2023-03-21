import "./Login.css";
import Navbar from "../components/Navbar";
import LoginBox from "./LoginBox";
import "../components/Theme.css";

function Login() {
    return (
        <div className="page-content">
            <Navbar/>
            <h1>
                Sign in or Register
            </h1>
            <p>
                to continue to your Spare Food Share account
            </p>
            <body className="login-body">
            <div className="login-box">
                <LoginBox />
            </div>
            </body>
        </div>
    );
}

export default Login;