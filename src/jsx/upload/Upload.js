import Navbar from "../components/Navbar";
import ProfileFramework from "../components/ProfileFramework";
import "./Upload.css";

function Upload() {
    return (
        <div className="page-content">
            <div className="my-profile">
                <Navbar/>
                <div className="profile-page">
                    <ProfileFramework/>
                    <div>
                        <form>
                            <label>
                                <p>Item name</p>
                            </label>
                            <input type="text" name="item_name" id="item_name"/>
                            <br/><br/>
                            <label>
                                <p>Description</p>
                            </label>
                            <input type="text" name="item_des" id="item_des"/>
                            <br/><br/>
                            <label>
                                <p>Expiry date</p>
                            </label>
                            <input type="date" name="item_expiration_date" id="item_expiration_date"/>
                            <br/><br/>
                            <label>
                                <p>Is is private</p>
                            </label>
                            <input type="checkbox" name="is_private" id="is_private"/>
                            <br/><br/>
                            <label>
                                <p>Location</p>
                            </label>
                            <input type="text" name="item_location" id="item_location"/>
                            <br/><br/>
                            <input type="submit"/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Upload;