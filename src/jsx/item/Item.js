import Navbar from "../components/Navbar";
import pic from "../pics/test.jpg"
import "./Item.css";
import "../components/Theme.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../AuthContext";

function Item(){
    const { item_id }  = useParams();
    const [item, setItem] = useState([]);
    const [isLoaded, setIsLoaded] = useState(true);
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
            console.log(id);
            const orderDetails = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: user.username, item_id: id})}

            let response = await fetch('http://127.0.0.1:8000/api/orders/', orderDetails);
            let data = await response.json()
            if(response.status == 200)
                console.log(data);
            let path = './';
            navigate(path);
        }
        console.log(item.item_pic);
        console.log(isLoaded);
//        const img_src = item.item_pic;
        const img_src = 'pics/carrot.svg';
        return(
            <div className="page-content">
                <Navbar />
                <body className="item-body">
                        <div className="item-content">
                            <img className="item-pic" src={ pic } />
                            <div className="item-vl"></div>
                            <div className="item_info">
                                <h3>Name:  { item.item_name }</h3>
                                <p>ID:  { item_id }</p>
                                <p>Description:  { item.item_des }</p><br />
                                <p>Provider: { item.item_provider }</p>
                                <p>Upload Date:  { item.item_upload_date }</p>
                                <p>Expiration Date:  { item.item_expiration_date }</p>
                                <p>Location:  { item.item_location }</p>
                                <p>Donations:<input type="text" /></p>
                            </div>
                            <button className="item-collect-btn" onClick={() => btn_clicked( item_id )}>Collect</button>
                        </div>
                </body>
                <hr />
            </div>
        );
    }

}
export default Item;