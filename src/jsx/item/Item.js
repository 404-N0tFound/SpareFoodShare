import Navbar from "../components/Navbar";
import pic from "../pics/test.jpg"
import "./Item.css";
import "../components/Theme.css";
function Item(){
    return(
        <div className="page-content">
            <Navbar />
            <body className="item-body">
                <div className="item-content">
                    <img className="item-pic" src={pic} />
                    <div className="item-vl"></div>
                    <div className="item_info">
                        <h3>Name:</h3>
                        <p>Descriptions:</p>
                    </div>
                    <button className="item-collect-btn">Collect</button>
                </div>
            </body>
        </div>
    );
}
export default Item;