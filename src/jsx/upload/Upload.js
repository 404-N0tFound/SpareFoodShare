import Navbar from "../components/Navbar";
import ProfileFramework from "../components/ProfileFramework";
import "./Upload.css";

function Upload() {
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
            let response = await fetch('http://127.0.0.1:8000/api/items/upload/', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    'name':e.target.name.value,
                    'description':e.target.description.value,
                    'expiration_date':e.target.expiration.value,
                    'is_private':e.target.is_private.checked,
                    'location':e.target.location.value
                })
            })
            let data = await response.json()
            if (response.status === 200 || response.status === 201) {
                navigator(0)
                alert(`New ${data.name} uploaded!`)
            } else {
                alert('Upload service failed! Is it maybe down?')
            }
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
                            <input type="submit"/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Upload;