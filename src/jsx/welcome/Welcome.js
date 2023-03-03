import "./Welcome.css";
import Navbar from "../components/Navbar";
import FruitBasket from "./FoodBasket";
import "../components/Theme.css";
import pic_1 from "../pics/pic-1.jpg";
import pic_2 from "../pics/pic-2.jpg";
import pic_3 from "../pics/pic-3.jpg";
function Welcome() {
    return (
        <div className="page-content">
            <Navbar />
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
                <hr />
                <div className="Welcome-display">
                    <div className="display-list">
                        <ul>
                            <li>
                                <img src={pic_1} className="display-pic-1" />
                                <div className="display-info">
                                    <p>123</p>
                                </div>
                            </li>

                             <li>
                                <img src={pic_2} className="display-pic-2" />
                                <div className="display-info">
                                    <p>123</p>
                                </div>
                            </li>
                             <li>
                                <img src={pic_3} className="display-pic-3" />
                                <div className="display-info">
                                    <p>123</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </body>
        </div>
    );
}

export default Welcome;
