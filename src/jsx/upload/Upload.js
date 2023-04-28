import Navbar from "../components/Navbar";
import ProfileFramework from "../components/ProfileFramework";
import "./Upload.css";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import jwtDecode from "jwt-decode";
import Footer from "../components/Footer";
import upload_pic from "../pics/upload-icon.jpeg";

function Upload() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedPreImage, setSelectedPreImage] = useState(null);
    const navigator = useNavigate();

    let handleImageChange = (e) => {
        setSelectedImage(e.target.files[0])
        setSelectedPreImage(URL.createObjectURL(event.target.files[0]));
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
            form_data.append('location', e.target.location.value);
            form_data.append('provider', user_id.toString());
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
            <div className="my-uploads">
                <Navbar/>
                <div className="upload-page">
                    <ProfileFramework/>
                    <div className="upload-box">
                        <form className="upload-form" onSubmit={createItem}>
                            <h2 className="form-title">
                                Upload Item
                            </h2>
                            <div className="row">
                                <div className="column">
                                    <div className="form-field">
                                        <label className="upload-label-top"><p>Item name</p></label>
                                        <input type="text" name="name" className="form-style" id="name"/>
                                    </div>
                                    <div className="form-field">
                                        <label className="upload-label"><p>Expiry date</p></label>
                                        <input type="date" name="expiration" className="form-style" id="expiration_date"/>
                                    </div>
                                    <div className="form-field">
                                        <label className="upload-label"><p>Location</p></label>
                                        <input type="text" name="location" className="form-style" id="location"/>
                                    </div>
                                    <div className="form-field">
                                        <label className="upload-label"><p>Description</p></label>
                                            <textarea name="description" className="form-style-descr" id="description"/>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="pic-field">
                                            <div className="display-item-image">
                                                <input type="file" className="img-input"
                                                       id="picture"
                                                       accept="image/png, image/jpeg"  onChange={handleImageChange} required/>
                                                {selectedImage != null && <img src={selectedPreImage} className="upload_pic_preview"/>}
                                                {selectedImage == null && <img src={upload_pic} className="upload_pic"/>}
                                            </div>
                                    </div>
                                </div>
                            </div>
                            <div className="button-div">
                                <button className="submit-button">submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Upload;