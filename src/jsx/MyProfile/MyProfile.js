import "./MyProfile.css";
import "../components/Theme.css";
import ProfileFramework from "../components/ProfileFramework";
import { useContext } from "react";
import AuthContext from "../AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MyProfile() {
    let {user} = useContext(AuthContext)
    return (
            <div className="page-content">
                <Navbar/>
                <ProfileFramework/>
                <div className="Personal_Details">
                    <div className="reg_form">
                        <form className="upload-form" action="src/jsx/MyProfile">
                            <ul>
                                <h2>Personal Details</h2>
                                <li >
                                    {user.is_business ? <p id= "Role_distinguish_para" >Role: Business</p> :<p id= "Role_distinguish_para">Role: individual</p>}
                                </li>
                                <li className="li1">
                                    <label htmlFor="username">User&nbsp;&nbsp;name：</label>
                                    <input type="text" className="inp" id="username" placeholder=""/>
                                </li>
                                <li>
                                    <label htmlFor="phone_number">Phone&nbsp;&nbsp;number：</label>
                                    <input type="text" className="inp"  id="phone_number" placeholder="+44"/>
                                </li>
                                <li>
                                    <label htmlFor="Email">Email&nbsp;&nbsp;address：</label>
                                    <input type="Email" className="inp" id="Email" placeholder="" readOnly/>
                                </li>
                                <li>
                                    <label htmlFor="Creation_date">Creation&nbsp;&nbsp;date： </label>
                                    <input type="date" className="inp" id="Creation_date" placeholder="" readOnly/>
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

