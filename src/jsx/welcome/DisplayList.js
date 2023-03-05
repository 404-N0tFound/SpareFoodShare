import "./DisplayList.css"
import {Fade} from "react-awesome-reveal";
import pic_1 from "../pics/pic-1.jpg";
import pic_2 from "../pics/pic-2.jpg";
import pic_3 from "../pics/pic-3.jpg";
import { Component } from "react";

class DisplayList extends Component {
    render() {
        return (
            <div className="display-list">
                <ul>
                    <Fade triggerOnce>
                        <li>
                            <div className="display-item">
                                <div className="display-item-image">
                                    <img src={pic_1} className="display-pic-1"/>
                                </div>
                                <div className="display-item-text">
                                    <div>
                                        <p>Shop for your groceries at lowered rates.</p>
                                    </div>
                                    <div>
                                        <a className="browseButton" type="button" href="./browse">
                                            Browse
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </Fade>

                    <Fade triggerOnce>
                        <li>
                            <div className="display-item">
                                <div className="display-item-image">
                                    <img src={pic_2} className="display-pic-2"/>
                                </div>
                                <div className="display-item-text">
                                    <div>
                                        <p>Join the community and help fight back against food wastage.</p>
                                    </div>
                                    <div>
                                        <a className="loginButton" type="button">
                                            Sign up
                                        </a>
                                        <a className="browseButton" type="button">
                                            Login
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </Fade>

                    <Fade triggerOnce>
                        <li>
                            <div className="display-item">
                                <div className="display-item-image">
                                    <img src={pic_3} className="display-pic-3"/>
                                </div>
                                <div className="display-item-text">
                                    <div>
                                        <p>Both large and small companies have the ability to prevent food wastage. Save food from going bad from your local retailers.</p>
                                    </div>
                                    <div>
                                        <a className="loginButton" type="button">
                                            Sign up
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </Fade>
                </ul>
            </div>
        );
    }
}

export default DisplayList;