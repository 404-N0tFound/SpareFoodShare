import Navbar from "../components/Navbar";
import pic from "../pics/test.jpg"
import "./Item.css";
import "../components/Theme.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
function Item(){
    const { item_id } : { item_id : string } = useParams();
    const [item, setItem] = useState([]);
    const [isLoaded, setIsLoaded] = useState(true);

    useEffect(() => {
        fetch('../api/items/'+item_id+'/')
            .then((response) => response.json())
            .then((data) => {
                            setIsLoaded(true);
                            setItem(data);})
    },[])

    let navigate = useNavigate();

    const btn_clicked = (id) => {
        console.log(id);
        let path = '../orders';
        navigate(path);
    }

    if(isLoaded){
        // if(isAvailable) // check if item is expired or deleted or becomes private, if so, show "page not available", and redirect to Browse page
        console.log(item.item_pic);
        console.log(isLoaded);
//        const img_src = item.item_pic;
        const img_src = 'pics/carrot.svg';
        return(
            <div className="page-content">
                <Navbar />
                <body className="item-body">
                        <div className="item-content">
                            <img className="item-pic" src={ require(`../${ img_src }`) } alt = { pic } />
                            <div className="item-vl"></div>
                            <div className="item_info">
                                <h3>Name:  { item.item_name }</h3>
                                <p>ID:  { item_id }</p>
                                <p>Description:  { item.item_des }</p><br />
                                <p>Provider: { item.item_provider }</p>
                                <p>Upload Date:  { item.item_upload_date }</p>
                                <p>Expiration Date:  { item.item_expiration_date }</p>
                                <p>Location:  { item.item_location }</p>
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