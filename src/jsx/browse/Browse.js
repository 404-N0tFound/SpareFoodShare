import { useState, useEffect } from 'react'
import "./Browse.css";
import Navbar from "../components/Navbar";
import pic from "./test.jpg"
function Browse(){

    const [items, setItems] = useState([]);

  const fetchData = () => {
    return fetch('../items/')
          .then((response) => response.json())
          .then((data) => setItems(data))
  }
  useEffect(() => {
    fetchData()
  },[])

  const btn_clicked = (id) => {
    alert('You clicked ' + id);
  };
    return (
        <div className="listings-page">
            <Navbar />
            <body className="listings-body">
                <div className="listings-content">
                    <ul>
                        <li>
                                <img className="item-pic" src={pic} />
                                    <div className="item_info">
                                        <h3>test</h3>
                                        <p>name: test</p>
                                        <button className="item_btn">Details</button>
                                    </div>
                        </li>
                        <li>
                                <img className="item-pic" src={pic} />
                                    <div className="item_info">
                                        <h3>test</h3>
                                        <p>name: test</p>
                                        <button className="item_btn">Details</button>
                                    </div>
                        </li>
                        {items && items.length > 0 && items.map((itemsObj, index) => (
                            <li key={index}>
                                <img className="item-pic" src={pic} />
                                    <div className="item_info">
                                        <h3>{itemsObj.id}</h3>
                                        <p>name: {itemsObj.item_name}</p>
                                        <button className="item_btn" onClick={() => btn_clicked(itemsObj.id)}>Details</button>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            </body>
        </div>
    );
}

export default Browse;