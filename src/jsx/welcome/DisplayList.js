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
                                        <h2>
                                        Who are we?
                                        </h2>
                                        <p>We are a charitable organisation helping individuals and businesses redistribute their excess food supplies.</p>
                                    </div>
                                    <div>
                                        <a className="browseButton" type="button" href="../browse">
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
                                        <h2>
                                        What can you do to help?
                                        </h2>
                                        <p>Join the community and help fight back against food wastage. Browse through the existing listings or post an item of your own.</p>
                                    </div>
                                    <div>
                                        <a className="loginButton" type="button">
                                            Sign up
                                        </a>
                                        <a className="browseButton" type="button" href="../login">
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
                                        <p>
                                            Share the benefits with the wider community using social media
                                        </p>
                                    </div>
                                    <div>
                                        <a className="loginButton" type="button">
                                            *THIS WILL BE SOCIAL MEDIA BUTTONS*
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