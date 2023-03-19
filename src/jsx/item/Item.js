import Navbar from "../components/Navbar";
import pic from "../pics/test.jpg"
import "./Item.css";
import "../components/Theme.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../AuthContext";
import Footer from "../components/Footer";

function Item(){
    const { item_id }  = useParams();
    const [item, setItem] = useState([]);
    const [isLoaded, setIsLoaded] = useState(true);
    const [donation, setDonation] = useState(0);
    let {user} = useContext(AuthContext);
    let navigate = useNavigate();

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/items/'+item_id+'/')
            .then((response) => response.json())
            .then((data) => {
                            setIsLoaded(true);
                            setItem(data);})
    },[])
        // if(isAvailable) // check if item is expired or deleted or becomes private, if so, show "page not available", and redirect to Browse page
    if(isLoaded){
        const btn_clicked = async(id) => {
            const orderDetails = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_item_id: id, order_initiator: user.email,
                                       order_donation_amount: donation, order_collection_location: 'location'})}
            let response = await fetch('http://127.0.0.1:8000/api/orders/', orderDetails);
            await response.json()
            let path = './';
            navigate(path);
        }
        const handleDonations = event =>{
            setDonation(event.target.value);
        };
        return(
            <div className="page-content">
                <Navbar />
                <body className="item-body">
                        <div className="item-content">
                            <img className="item-pic" src={ pic } />
                            <div className="item-vl"></div>
                            <div className="item_info">
                                <h3>Name:  { item.item_name }</h3>
                                <p><b>ID:</b>  { item_id }</p>
                                <p><b>Description:</b>  { item.item_des }</p><br />
                                <p><b>Provider:</b> { item.item_provider }</p>
                                <p><b>Upload Date:</b>  { item.item_upload_date }</p>
                                <p><b>Expiration Date:</b>  { item.item_expiration_date }</p>
                                <p><b>Location:</b>  { item.item_location }</p>
                                <p><b>Donations:</b><input type="number" onChange={ handleDonations } placeholder="0~10" min="0" max="10"/>  You made a ￡{ donation } donation:)</p>
                            </div>
                            <button className="item-collect-btn" onClick={() => btn_clicked( item_id )}>Collect</button>
                        </div>
                </body>
                <hr />
                <Footer />
            </div>
        );
    }

}
export default Item;