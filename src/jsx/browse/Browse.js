import { useState, useEffect } from 'react';
import "./Browse.css";
import "../components/Theme.css";
import Navbar from "../components/Navbar";
import pic from "../pics/test.jpg"
import {useNavigate} from "react-router-dom";
import apple from "../pics/apple.svg";
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
        console.log(items)
        return (
            <div className="page-content">
                <Navbar />
                <body className="listings-body">
                    <div className="listings-content">
                        <ul>
                            <div className="item-card">
                                <li>
                                    <img className="items-pic" src={ pic } />
                                        <div className="item_info">
                                            <h3>Name</h3>
                                            <p>Descriptions</p>
                                            <p>Provider</p>
                                            <p>Location</p>
                                        </div>
                                        <button className="item_btn" onClick={() => btn_clicked(1)}>Details</button>
                                </li>
                            </div>

                            <div className="item-card">
                                <li>
                                    <img className="items-pic" src={apple} />
                                        <div className="item_info">
                                            <h3>Name</h3>
                                            <p>Descriptions</p>
                                            <p>Provider</p>
                                            <p>Location</p>
                                        </div>
                                        <button className="item_btn" onClick={() => btn_clicked(2)}>Details</button>
                                </li>
                            </div>
                            {items && items.map(itemsObj => (
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