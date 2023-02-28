import "./Welcome.css";
import WelcomePageNavbar from "./WelcomePageNavbar";

function Welcome() {
    return (
        <div className="Welcome">
            <body className="Welcome-body">
                <WelcomePageNavbar />
                <h1>
                    Our mission is to facilitate food sharing within the community, battling food waste and insecurity.
                </h1>
                <p>
                    It is estimated that the UK&apos;s total food waste could feed upwards of 30 million people in a year. Be part of the solution, not the problem - share your spare groceries with people in your area!
                </p>
                <input className="loginButton" type="button" value="Login"/>
                <input className="browseButton" type="button" value="Browse"/>
            </body>
        </div>
    );
}

export default Welcome;
