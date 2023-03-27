import Navbar from "../components/Navbar";
import "./Item.css";
import "../components/Theme.css";
import { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../AuthContext";
import Footer from "../components/Footer";

function Item(){
    const [item, setItem] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [donation, setDonation] = useState(0);

    let {user} = useContext(AuthContext);
    let navigate = useNavigate();
    const { item_id } = useParams();
    let button;

    const getItemData = () => {
        return fetch('http://127.0.0.1:8000/api/item/?uuid=' + item_id)
            .then((response) => response.json())
            .then((data) => {
                            setIsLoaded(true);
                            setItem(data);})
    }
    const checkDuplicateOrder = () => {
        return fetch(`http://127.0.0.1:8000/api/orders/check/?user=${user.user_id}&item=${item_id}`, {
            method:'GET'
            }).then((response) => response.json())
            .then((data) => {if(data==true)setIsDuplicate(true)})
    }
    useEffect(() => {
        getItemData();
        checkDuplicateOrder();
    },[])

    if(isLoaded){
        if(item == false)
        {
            alert("This item is not available anymore");
            navigate('../browse');
        }else{
            const btn_clicked = async() => {
                const orderDetails = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ item: item.id, initiator: user.user_id,
                                           donation_amount: donation})}
                let response = await fetch('http://127.0.0.1:8000/api/orders/create/', orderDetails);
                await response.json()
                alert("You order has been created!")
                navigate('../browse');
            }

            const handleDonations = event =>{
                setDonation(event.target.value);
            };

            if(isDuplicate)
                button = <button disabled className="item-collected-btn">Interested</button>
            else
                button = <button className="item-collect-btn" onClick={() => btn_clicked()}>Register</button>

            return(

                <div className="page-content">
                    <Navbar />
                    <body className="item-body">
                        <div className="item-content">
                            <img className="item-pic" src={`http://127.0.0.1:8000${item.picture}`} />
                            <div className="item-vl"></div>
                            <div className="item_info">
                                <h3>Name:  { item.name }</h3>
                                <p><b>Description:</b>  { item.description }</p>
                                <p><a href = {`mailto: ${item.provider}`}>Contact Provider</a></p>
                                <p><b>Upload Date:</b>  { item.upload_date }</p>
                                <p><b>Expiration Date:</b>  { item.expiration_date }</p>
                                <p><b>Location:</b>  { item.location }</p>
                                <p><b>Donations:</b><input type="number" onChange={ handleDonations } placeholder="0~10" min="0" max="10"/>  You made a ￡{ donation } donation:)</p>
                            </div>
                            {button}
                        </div>
                    </body>
                    <hr />
                    <Footer />
                </div>
            );
        }
    }

}
export default Item;