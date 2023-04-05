import "../components/Theme.css";
import "./Chats.css";
import ProfileFramework from "../components/ProfileFramework";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {PureComponent} from "react";

class Chats extends PureComponent{
    render() {
        return (
            <div className="page-content">
                <Navbar/>
                <body className="chats-body">
                <ProfileFramework />
                <p>REEEEEE</p>
                </body>
                <Footer id="foot_id"/>
            </div>
        );
    }

}

export default Chats;