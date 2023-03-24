import "./MyProfile.css";
import "../components/Theme.css";
import ProfileFramework from "../components/ProfileFramework";
import { useContext } from "react";
import AuthContext from "../AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MyProfile() {
    let {user} = useContext(AuthContext)
    let role;
    if(user.is_business)
        role = <p>Role: Business</p>

    return(
        <div className="page-content">
          <Navbar />
          <ProfileFramework />
          <div className="myprofile-page">
            <div>
              <p>
                 Master Windu, <b><i>you survived...</i></b>
              </p>
                 {user && <p>It&apos;s over {user.full_name}, I have the high ground!</p>}
                 {role}
            </div>
          </div>

          <Footer />
        </div>
    );
}

export default MyProfile;
