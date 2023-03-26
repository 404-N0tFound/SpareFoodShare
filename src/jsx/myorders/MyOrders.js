import "../components/Theme.css";
import ProfileFramework from "../components/ProfileFramework";
import Navbar from "../components/Navbar";
import { useState, useEffect } from 'react';
import { useContext } from "react";
import AuthContext from "../AuthContext";

function MyOrders() {
    let {user} = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/orders/?user_id='+user.user_id)
            .then((response) => response.json())
            .then((data) => {
                             setIsLoaded(true);
                             setOrders(data);})
        },[])
    if(isLoaded){
    console.log(orders)
        return(
            <div className="page-content">
                <div className="my-orders">
                    <Navbar />
                    <div className="my-orders-page">
                        <ProfileFramework />
                        <div className="my-orders-details">
                            TEST
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default MyOrders;