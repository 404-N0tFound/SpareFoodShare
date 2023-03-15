import { useState, useEffect } from 'react';
import "./Browse.css";
import "../components/Theme.css";
import Navbar from "../components/Navbar";
import pic from "../pics/test.jpg"
import {useNavigate} from "react-router-dom";
import carrot from "../pics/carrot.svg";
import apple from "../pics/apple.svg";
import mushroom from "../pics/mushroom.svg";

function Browse(){
  const [items, setItems] = useState([]);
  const fetchData = () => {
    return fetch('../api/items/')
          .then((response) => response.json())
          .then((data) => setItems(data))
  }
  useEffect(() => {
    fetchData()
  },[])

  let navigate = useNavigate();

  const btn_clicked = (id) => {
    alert('You clicked ' + id);
    let path = '../item/' + id;
    navigate(path);
}
    return (
        <div className="page-content">
            <Navbar />
            <body className="listings-body">
                <div className="listings-content">
                    <ul>
                        <div className="item-card">
                            <li>
                                <img className="items-pic" src={carrot} />
                                    <div className="item_info">
                                        <h3>Name</h3>
                                        <p>Descriptions</p>
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
                                    </div>
                                    <button className="item_btn" onClick={() => btn_clicked(2)}>Details</button>
                            </li>
                        </div>
                        <div className="item-card">
                            <li>
                                <img className="items-pic" src={mushroom} />
                                    <div className="item_info">
                                        <h3>Name</h3>
                                        <p>Descriptions</p>
                                    </div>
                                    <button className="item_btn" onClick={() => btn_clicked(3)}>Details</button>
                            </li>
                        </div>
                        {items && items.length > 0 && items.map((itemsObj, index) => (
                            <li key={index}>
                                <img className="items-pic" src={pic} />
                                    <div className="item_info">
                                        <h3>Name: {itemsObj.id}</h3>
                                        <p>Des: {itemsObj.item_name}</p>
                                    </div>
                                    <button className="item_btn" onClick={() => btn_clicked( itemsObj.id )}>Details</button>
                                </li>
                            ))}
                    </ul>
                </div>
            </body>
            <Footer />
        </div>
    );
}

export default Browse;