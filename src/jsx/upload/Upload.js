import Navbar from "../components/Navbar";
import ProfileFramework from "../components/ProfileFramework";
import "./Upload.css";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import jwtDecode from "jwt-decode";
import Footer from "../components/Footer";
import upload_pic from "../pics/upload-icon.jpeg";
import defaultImage from '../upload/default_image.jpg';

function Upload() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedPreImage, setSelectedPreImage] = useState(null);
    const [csvData, setCsvData] = useState(null);
    const navigator = useNavigate();

    let handleImageChange = (e) => {
        setSelectedImage(e.target.files[0])
        setSelectedPreImage(URL.createObjectURL(event.target.files[0]));
    };

    let handleCSVChange = async (e) => {
        const file = e.target.files[0];
        const content = await file.text();
        const csvLines = content.split("\n");
        const headers = csvLines[0].split(",");
        const items = [];

        for (let i = 1; i < csvLines.length; i++) {

            const data = csvLines[i].split(",")
            if (data.length === headers.length) {
                const item = {};
                for (let j = 0; j < headers.length; j++) {
                    item[headers[j].trim()] = data[j].trim()
                }
                items.push(item)
            }
        }
        setCsvData(items)
        console.log(items)
    };

    let convertImageToBase64 = async (imageUrl) => {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    let uploadCsv = async (e) =>{
        e.preventDefault()

        if (csvData) {
            const csvLines = String(csvData).split("\n");
            const user_id = jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access).user_id;
            const defaultImageData = await convertImageToBase64(defaultImage);

            let url = 'http://127.0.0.1:8000/api/items/upload/';
            let itemsDataArray = [];
            console.log(csvLines)

            for (let i = 0; i < csvData.length; i++) {
                const item = csvData[i];
                const headers = Object.keys(item);

                let form_data = new FormData();

                for (const header of headers) {
                    if (header === "is_private") {
                        form_data.append(header, item[header] === "1" ? true : false);
                    } else if (header === "provider_id") {
                        form_data.append("provider_id", user_id);
                    } else {
                        form_data.append(header, item[header]);
                    }
                }

                // Add default picture
                const byteString = atob(defaultImageData.split(',')[1]);
                const arrayBuffer = new ArrayBuffer(byteString.length);
                const byteArray = new Uint8Array(arrayBuffer);
                for (let k = 0; k < byteString.length; k++) {
                    byteArray[k] = byteString.charCodeAt(k);
                }
                const blob = new Blob([arrayBuffer], { type: "image/jpeg" });
                const pictureFile = new File([blob], "default_image.jpg", { type: "image/jpeg" });
                form_data.append("picture", pictureFile, pictureFile.name);

                itemsDataArray.push(form_data);
            }

            itemsDataArray.map((item, index) => {
                console.log(`Item ${index}:`);
                for (let pair of item.entries()) {
                    console.log(pair[0] + ": " + pair[1]);
                }
            });

            Promise.all(
                itemsDataArray.map(formData =>
                    axios.post(url, formData, {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    })
                )
            )
                .then(responses => {
                    responses.forEach(response => {
                        console.log(`New ${response.data.name} uploaded!`);
                    });
                    navigator('../browse');
                    alert(`${responses.length} items uploaded!`);
                })
                .catch(err => console.log(err));
        }
    }


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
                        <form onSubmit={uploadCsv}>
                            <label>
                                <p>CSV File</p>
                            </label>
                            <input type="file" id="csv_file" accept=".csv" onChange={handleCSVChange} required/>
                            <input type="submit"/>
                        </form>
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