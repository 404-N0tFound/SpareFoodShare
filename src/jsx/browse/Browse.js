import { useState, useEffect } from 'react';
import "./Browse.css";
import "../components/Theme.css";
import Navbar from "../components/Navbar";
import pic from "../pics/test.jpg"
import {useNavigate} from "react-router-dom";
import Footer from "../components/Footer";

function Browse(){
    const [items, setItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const fetchData = () => {
        return fetch('http://127.0.0.1:8000/api/items/')
            .then((response) => response.json())
            .then((data) => {
                            setItems(data);
                            setIsLoaded(true);})
            }
    useEffect(() => {
     fetchData()
    },[])

    let navigate = useNavigate();

    const btn_clicked = (id) => {
         let path = '../item/' + id;
         navigate(path);
    }
    if(isLoaded){
        return (
            <div className="page-content">
                <Navbar />
                <body className="listings-body">
                    <div className="listings-content">
                        <ul>
                            {items && items.map((itemsObj) => (
                                (!itemsObj.item_isPrivate && !itemsObj.item_isExpired && !itemsObj.item_isDeleted) ? (
                                    <div key={itemsObj.id} className="item-card">
                                        <li>
                                            <img className="items-pic" src={ pic } />
                                            <div className="item_info">
                                                <h3>Name: {itemsObj.item_name}</h3>
                                                <p>Des: {itemsObj.item_des}</p>
                                                <p>Provider: { itemsObj.item_provider }</p>
                                                <p>Location: { itemsObj.item_location }</p>
                                            </div>
                                            <button className="item_btn" onClick={() => btn_clicked( itemsObj.id )}>Details</button>
                                        </li>
                                    </div>
                                ): null
                            ))}
                        </ul>

                    </div>
                </body>
                <Footer />
            </div>
        );
    }
}

export default Browse;