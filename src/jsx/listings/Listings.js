import { useState, useEffect } from 'react'
import "./Listings.css";
import Navbar from "../components/Navbar";

function Listings(){

    const [items, setItems] = useState([]);

  const fetchData = () => {
    return fetch('../items/')
          .then((response) => response.json())
          .then((data) => setItems(data))
  }
  useEffect(() => {
    fetchData()
  },[])
    return (
        <div className="listings-page">
            <Navbar />
            <body className="listings-body">
                <div className="listings-table-div">
                    <table className="listings-table">
                        <tr>
                            <th>id</th>
                            <th>Name</th>
                            <th>Des</th>
                            <th>upload date</th>
                            <th>expiration date</th>
                            <th>provider</th>
                            <th>pricing</th>
                            <th>status</th>
                            <th>isprivate</th>
                            <th>location</th>
                        </tr>
                        {items && items.length > 0 && items.map((itemsObj, index) => (
                           <tr key={index}>
                             <th key={index}>{itemsObj.id}</th>
                             <th key={index}>{itemsObj.item_name}</th>
                             <th key={index}>{itemsObj.item_des}</th>
                             <th key={index}>{itemsObj.item_upload_date}</th>
                             <th key={index}>{itemsObj.item_expiration_date}</th>
                             <th key={index}>{itemsObj.item_provider}</th>
                             <th key={index}>{itemsObj.item_pricing}</th>
                             <th key={index}>{itemsObj.item_status}</th>
                             <th key={index}>{itemsObj.item_isprivate}</th>
                             <th key={index}>{itemsObj.item_location}</th>
                            </tr>
                        ))}
                    </table>
                </div>
            </body>
        </div>
    );
}

export default Listings;