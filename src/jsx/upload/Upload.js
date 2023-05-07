import Navbar from "../components/Navbar";
import ProfileFramework from "../components/ProfileFramework";
import "./Upload.css";
import {useState} from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {useNavigate} from "react-router-dom";
import Footer from "../components/Footer";
import upload_pic from "../pics/upload-icon.jpeg";
import default_local_image from "../pics/default_local_image.png";

function Upload() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedPreImage, setSelectedPreImage] = useState(null);
    const [csvData, setCsvData] = useState(null);
    const [selectedDefaultImage, setSelectedDefaultImage] = useState(null);
    const isBusiness = jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access).is_business;
    const navigator = useNavigate();
    let isFormatValid = true;

    let handleImageChange = (e) => {
        setSelectedImage(e.target.files[0])
        setSelectedPreImage(URL.createObjectURL(event.target.files[0]));
    };

    let handleDefaultImageChange = (e) => {
        setSelectedDefaultImage(e.target.files[0]);
    };


    let dataURLtoBlob = async (dataUrl) => {
        const response = await fetch(dataUrl);
        return response.blob();
    }

    let handleCSVChange = async (e) => {
        const file = e.target.files[0];
        const content = await file.text();
        const csvLines = content.split("\n");
        const headers = csvLines[0].split(",");
        const items = [];
        const expectedHeaders = ["name", "description", "expiration_date", "location"];

        isFormatValid = true;

        if (headers.length !== expectedHeaders.length || !headers.every((header, index) => header.trim() === expectedHeaders[index])) {
            isFormatValid = false;
            alert("CSV file headers are incorrect. Please use: name, description, expiration_date, location");
            return;
        }

        for (let i = 1; i < csvLines.length; i++) {

            const data = csvLines[i].split(",")
            if (data.length === headers.length) {
                const item = {};
                for (let j = 0; j < headers.length; j++) {
                    item[headers[j].trim()] = data[j].trim()
                }
                items.push(item)
            } else {
                isFormatValid = false;
                alert("CSV file format are incorrect. Please ensure the number of columns matches the header and try again");
                break;
            }
        }
        if (isFormatValid) {
            setCsvData(items);
        } else {
            setCsvData(null);
        }
    };

    let uploadCsv = async (e) =>{
        e.preventDefault()

        if (csvData) {
            const jwt = JSON.parse(localStorage.getItem('authTokens')).access;
            const defaultImageData = selectedDefaultImage
            let url = 'http://127.0.0.1:8000/api/items/upload/';
            let itemsDataArray = [];

            for (let i = 0; i < csvData.length; i++) {
                const item = csvData[i];
                const headers = Object.keys(item);
                let form_data = new FormData();

                form_data.append("provider", jwt);

                for (const header of headers) {
                    form_data.append(header, item[header]);
                }

                if (defaultImageData) {
                    form_data.append("picture", defaultImageData, defaultImageData.name);
                } else {
                    const defaultLocalImageBlob = await dataURLtoBlob(default_local_image);
                    const file = new File([defaultLocalImageBlob], "default_local_image.png", {
                        type: "image/*",
                    });
                    form_data.append("picture", file);
                }
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
                .catch(
                    err => console.log(err)
                );
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
            const jwt = JSON.parse(localStorage.getItem('authTokens')).access;
            let form_data = new FormData();
            form_data.append('picture', selectedImage, selectedImage.name);
            form_data.append('name', e.target.name.value);
            form_data.append('description', e.target.description.value);
            form_data.append('expiration_date', e.target.expiration.value);
            form_data.append('location', e.target.location.value);
            form_data.append('provider', jwt);
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
                        {isBusiness ? (
                            <form className="csv-upload-form" onSubmit={uploadCsv}>
                                <h2>Upload Item by CSV File</h2>
                                <p>Please use the following as the first row of the CSV file and fill in the data by column:</p>
                                <p><b>name, description, expiration_date, location</b></p>
                                <label>
                                    <input type="file" id="csv_file" accept=".csv" onChange={handleCSVChange} required/>
                                    <span className="file-input-text">Please select a CSV file</span>
                                </label>
                                <br/>
                                <label>
                                    <input type="file" id="defaultImageInput" accept="image/*" onChange={handleDefaultImageChange} />
                                    <span className="file-input-text">Please select an image for the uploaded items(OPTION)</span>
                                </label>
                                <div className="button-div">
                                    <button className="submit-button">submit</button>
                                </div>
                            </form>
                        ) : null}
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