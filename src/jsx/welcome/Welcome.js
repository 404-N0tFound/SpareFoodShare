import "./Welcome.css";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import DisplayList from "./DisplayList";
import FruitBasket from "./FoodBasket";
import {Fade} from "react-awesome-reveal";
import "../components/Theme.css";

function Welcome() {
    return (
        <div className="page-content">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <Navbar/>
            <body className="Welcome-body">
            <div className="Welcome-information">
                <div className="Welcome-information-text">
                    <Fade triggerOnce>
                        <h1>
                            Our mission is to facilitate food sharing within the community, battling food waste and
                            insecurity.
                        </h1>
                    </Fade>
                    <Fade triggerOnce>
                        <p>
                            It is estimated that the UK&apos;s total food waste could feed upwards of 30 million people
                            in a
                            year. Be
                            part of the solution, not the problem - share your spare groceries with people in your area!
                        </p>
                    </Fade>
                </div>
                <div className="Welcome-information-interactable">
                    <FruitBasket/>
                </div>
            </div>
            <div className="Welcome-display">
                <DisplayList />
            </div>
            </body>
            <Footer />
        </div>
    );
}

export default Welcome;
