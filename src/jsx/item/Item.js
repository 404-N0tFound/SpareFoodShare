import Navbar from "../components/Navbar";
import pic from "../pics/test.jpg"
import "./Item.css";
import "../components/Theme.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
function Item(){
    const { item_id } : { item_id : string } = useParams();
    const [item, setItem] = useState([]);
    const fetchData = () => {
        return fetch('../api/items/'+item_id+'/')
            .then((response) => response.json())
            .then((data) => setItem(data))
    }
    useEffect(() => {
        fetchData()
    },[])
    return(
        <div className="page-content">
            <Navbar />
            <body className="item-body">
                    <div className="item-content">
                        <img className="item-pic" src={ pic } />
                        <div className="item-vl"></div>
                        <div className="item_info">
                            <h3>Name: { item.item_name }</h3>
                            <p>ID:{ item_id }</p>
                            <p>Description:</p><br />
                            <p>Provider:</p>
                            <p>Upload Date:</p>
                            <p>Expiration Date:</p>
                            <p>Location:</p>
                        </div>
                        <button className="item-collect-btn">Collect</button>
                    </div>
            </body>
            <hr />
        </div>
    );
}
export default Item;