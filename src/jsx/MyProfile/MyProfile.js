import "./MyProfile.css";
import "../components/Theme.css";
import ProfileFramework from "../components/ProfileFramework";
import { useContext } from "react";
import AuthContext from "../AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MyProfile() {
    let {user, updateNewToken} = useContext(AuthContext)
    let anyChange = false;

    let updateProfile = async(e) => {
        e.preventDefault();
        if(anyChange){
            let full_name = e.target.username.value;
            let phone_number = e.target.phone_number.value;
            try {
                let response = await fetch("http://127.0.0.1:8000/api/user/update_profile/", {
                    method: "POST",
                    headers:{
                        'Content-Type' : 'application/json'
                        },
                        body: JSON.stringify({'jwt': JSON.parse(localStorage.getItem('authTokens')).access, 'full_name': full_name, 'phone_number': phone_number})
                })
                if(response.status === 200) {
                    await updateNewToken(JSON.parse(localStorage.getItem('authTokens')).access);
                    alert("Update Successfully!");
                    window.location.reload();
                }
            } catch(e) {
                alert('Update failed! Is it maybe down?')
            }
        }else{
            alert("You haven't done any changes!");
        }

    }
    let onChange = () => {
        anyChange = true;
    }

    return (
            <div className="page-content">
                <Navbar/>
                <ProfileFramework/>
                <div className="Personal_Details">
                    <div className="reg_form">
                        <form className="personal-details-form" onSubmit={updateProfile}>
                            <ul>
                                <h2>Personal Details</h2>
                                <li >
                                    {user.is_business && !user.is_admin ? <p id= "Role_distinguish_para" >Role: Business</p> : !user.is_admin ? <p id= "Role_distinguish_para">Role: individual</p> : null}
                                    {user.is_admin ? <p id= "Admin_distinguish_para" >Admin</p> : null}
                                </li>
                                <li className="li1">
                                    <label htmlFor="username">User&nbsp;&nbsp;name：</label>
                                    <input type="text" className="inp" id="username" placeholder="" defaultValue={user.full_name} onChange={onChange} required />
                                </li>
                                <li>
                                    <label htmlFor="phone_number">Phone&nbsp;&nbsp;number：</label>
                                    <input type="text" className="inp"  id="phone_number" defaultValue={user.phone_number} onChange={onChange} />
                                </li>
                                <li>
                                    <label htmlFor="Email">Email&nbsp;&nbsp;address：</label>
                                    <input type="Email" className="inp" id="Email" placeholder="" readOnly defaultValue={user.email}/>
                                </li>
                                <li>
                                    <label htmlFor="Creation_date">Creation&nbsp;&nbsp;date： </label>
                                    <input type="text" className="inp" id="Creation_date" placeholder="" readOnly defaultValue={user.date_joined}/>
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

