import "./MyProfile.css";
import "../components/Theme.css";
import ProfileFramework from "../components/ProfileFramework";
import { useContext } from "react";
import AuthContext from "../AuthContext";

function MyProfile() {
    let {user} = useContext(AuthContext)
    return(
        <div className="my-profile">
            <ProfileFramework />
            <p>
                Master Windu, <b><i>you survived...</i></b>
            </p>
            {user && <p>It&apos;s over {user.username}, I have the high ground!</p>}
        </div>
    );
}

export default MyProfile;