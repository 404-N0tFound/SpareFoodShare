import "./MyProfile.css";
import "../components/Theme.css";
import ProfileFramework from "../components/ProfileFramework";
//import {useContext} from "react";                         //I keep the code here for some potential later changes:)
//import AuthContext from "../AuthContext";                 //I keep the code here for some potential later changes:)
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MyProfile() {
    //let {user} = useContext(AuthContext)                  //I keep the code here for some potential later changes:)
    //let role;
    //if (user.is_business)
        //role = <p>Role: Business</p>
        return (
            <div className="page-content">
                <Navbar/>
                <ProfileFramework/>
                <div className="Personal_Details">
                    <div className="reg_form">
                        <form className="upload-form" action="src/jsx/MyProfile">
                            <ul>
                                <h2>Personal Details</h2>
                                <li className="li1">
                                    <label htmlFor="username">Name：</label>
                                    <input type="text" className="inp" name="username" id="username" placeholder=""/>
                                </li>
                                <li>
                                    <label htmlFor="phone_number">Phone&nbsp;&nbsp;number：</label>
                                    <input type="text" className="inp" name="username" id="phone_number" placeholder="+44"/>
                                </li>
                                <li>
                                    <label htmlFor="email">Email：</label>
                                    <input type="email" className="inp" name="username" id="email" placeholder=""/>
                                </li>
                                <li>
                                    <label htmlFor="password">Password：</label>
                                    <input type="password" className="inp" name="username" id="password" placeholder=""/>
                                </li>
                                <li>
                                    <label htmlFor="location">Location：</label>
                                    <input type="text" className="inp" name="username" id="location" placeholder=""/>
                                </li>
                                <li>
                                    <label htmlFor="description">My&nbsp;&nbsp;Introduction：</label>
                                    <input type="text" className="inp" name="username" id="description" placeholder="Some words to introduce yourself!" />
                                </li>
                            </ul>
                            <div>
                                <button className="button" type="submit">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
                <Footer/>
            </div>
        );
}

export default MyProfile;

