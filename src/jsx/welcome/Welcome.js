import "./Welcome.css";
import WelcomePageNavbar from "./WelcomePageNavbar";
import FruitBasket from "./FoodBasket"

function Welcome() {
    return (
        <div className="Welcome">
            <WelcomePageNavbar />
            <body className="Welcome-body">
                <div className="Welcome-information">
                    <div className="Welcome-information-text">
                        <h1>
                            Our mission is to facilitate food sharing within the community, battling food waste and insecurity.
                        </h1>
                        <p>
                            It is estimated that the UK&apos;s total food waste could feed upwards of 30 million people in a year. Be part of the solution, not the problem - share your spare groceries with people in your area!
                        </p>
                    </div>
                    <div className="Welcome-information-interactable">
                        <FruitBasket />
                    </div>
                </div>
                <div className="Interact-buttons">
                    <input className="loginButton" type="button" value="Login"/>
                    <input className="browseButton" type="button" value="Browse"/>
                </div>
            </body>
        </div>
    );
}

export default Welcome;
