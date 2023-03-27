import Navbar from "../components/Navbar";
import ProfileFramework from "../components/ProfileFramework";
import "./Upload.css";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Footer from "../components/Footer";

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
            let form_data = new FormData();
            form_data.append('picture', selectedImage, selectedImage.name);
            form_data.append('name', e.target.name.value);
            form_data.append('description', e.target.description.value);
            form_data.append('expiration_date', e.target.expiration.value);
            form_data.append('is_private', e.target.is_private.checked);
            form_data.append('location', e.target.location.value);
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

            /*
            const postData = new FormData();
            postData.append('name', e.target.name.value)
            postData.append('description', e.target.description.value)
            postData.append('expiration_date', e.target.expiration.value)
            postData.append('is_private', e.target.is_private.checked)
            postData.append('location', e.target.location.value)
            postData.append('picture', selectedImage)
            let response = await fetch('http://127.0.0.1:8000/api/items/upload/', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: postData
            })
            let data = await response.json()
            if (response.status === 200 || response.status === 201) {
                navigator(0)
                alert(`New ${data.name} uploaded!`)
            } else {
                alert('Upload service failed! Is it maybe down?')
            }
            */
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
                                    <div className="private-check">
                                        <label className="upload-label"><p>Is it private?</p>
                                        <input type="checkbox" name="is_private" id="is_private"/>
                                            <span className="checkmark"></span>
                                        </label>
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
                                            <div className="upload-display-item-image">
                                                <input type="file" className="img-input"
                                                       id="picture"
                                                       accept="image/png, image/jpeg"  onChange={handleImageChange} required/>
                                                <label htmlFor="picture">Upload picture(s)</label>
                                                <p>Upload picture(s)</p>
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