import "./MyProfile.css";
import "../components/Theme.css";
import ProfileFramework from "../components/ProfileFramework";
import { useContext } from "react";
import AuthContext from "../AuthContext";
import Navbar from "../components/Navbar";

function MyProfile() {
    let {user} = useContext(AuthContext)
    return(
        <div className="page-content">
            <div className="my-profile">
                <Navbar />
                <div className="profile-page">
                    <ProfileFramework />
                    <div>
                        <p>
                            Master Windu, <b><i>you survived...</i></b>
                        </p>
                        {user && <p>It&apos;s over {user.username}, I have the high ground!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyProfile;