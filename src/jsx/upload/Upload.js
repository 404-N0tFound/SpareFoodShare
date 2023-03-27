import Navbar from "../components/Navbar";
import ProfileFramework from "../components/ProfileFramework";
import "./Upload.css";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import jwtDecode from "jwt-decode";

function Upload() {
    const [selectedImage, setSelectedImage] = useState(null);
    const navigator = useNavigate();

    let handleImageChange = (e) => {
        setSelectedImage(e.target.files[0])
    };

    let createItem = async (e) => {
        e.preventDefault()
        if (!e.target.name.value) {
            alert("Please enter a name")
        } else if (!e.target.description.value) {
            alert("Don't forget to enter a description")
        } else if (!e.target.expiration.value) {
            alert("Don't forget to enter an expiration date")
        } else if (!e.target.location.value) {
            alert("Don't forget to enter a distribution location")
        } else {
            const user_id = jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access).user_id;
            let form_data = new FormData();
            form_data.append('picture', selectedImage, selectedImage.name);
            form_data.append('name', e.target.name.value);
            form_data.append('description', e.target.description.value);
            form_data.append('expiration_date', e.target.expiration.value);
            form_data.append('is_private', e.target.is_private.checked);
            form_data.append('location', e.target.location.value);
            form_data.append('provider_id', user_id.toString());
            console.log(form_data);
            let url = 'http://127.0.0.1:8000/api/items/upload/';
            axios.post(url, form_data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
                .then(res => {
                    navigator('../browse')
                    alert(`New ${res.data.name} uploaded!`)
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <div className="page-content">
            <div className="my-profile">
                <Navbar/>
                <div className="profile-page">
                    <ProfileFramework/>
                    <div>
                        <form onSubmit={createItem}>
                            <label>
                                <p>Item name</p>
                            </label>
                            <input type="text" name="name" id="name"/>
                            <br/><br/>
                            <label>
                                <p>Description</p>
                            </label>
                            <input type="text" name="description" id="description"/>
                            <br/><br/>
                            <label>
                                <p>Expiry date</p>
                            </label>
                            <input type="date" name="expiration" id="expiration_date"/>
                            <br/><br/>
                            <label>
                                <p>Is is private</p>
                            </label>
                            <input type="checkbox" name="is_private" id="is_private"/>
                            <br/><br/>
                            <label>
                                <p>Location</p>
                            </label>
                            <input type="text" name="location" id="location"/>
                            <br/><br/>
                            <label>
                                <p>Picture</p>
                            </label>
                            <input type="file"
                                   id="picture"
                                   accept="image/png, image/jpeg"  onChange={handleImageChange} required/>
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