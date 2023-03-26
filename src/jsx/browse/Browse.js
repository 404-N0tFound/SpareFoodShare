/* eslint-disable */
import "./Browse.css";
import "../components/Theme.css";
import Navbar from "../components/Navbar";
import carrot from "../pics/carrot.svg";
import apple from "../pics/apple.svg";
import mushroom from "../pics/mushroom.svg";

function Browse() {
    return (
        <div className="page-content">
            <Navbar/>
            <body className="listings-body">
                <a className="item-card" id="myBtn" onClick={openModal}>
                    <img className="items-pic" src={carrot} alt="carrot"/>
                    <h1>Carrot</h1>
                    <p>Expiry Date</p>
                    <p><button>Register Interest</button></p>
                </a>
                <a className="item-card" id="myBtn" onClick={openModal}>
                    <img className="items-pic" src={apple} alt="apple"/>
                    <h1>Apple</h1>
                    <p>Expiry Date</p>
                    <p><button>Register Interest</button></p>
                </a>
                <a className="item-card" id="myBtn" onClick={openModal}>
                    <img className="items-pic" src={mushroom} alt="mushroom"/>
                    <h1>Mushroom</h1>
                    <p>Expiry Date</p>
                    <p><button>Register Interest</button></p>
                </a>
                <div className="modal" id="myModal">
                    <div className="modal-content">
                        <span onClick={closeModal} className="close">&times;</span>
                        <img className="items-pic" src={carrot} alt="carrot"/>
                        <h1>Carrot</h1>
                        <p>Description: </p>
                        <p>Location: </p>
                        <p>Expiry Date: </p>
                        <p><button>Register Interest</button></p>
                    </div>
                </div>
            </body>
        </div>
    );
}

// Get the modal
const modal = document.getElementById("myModal");

// Get the button that opens the modal
const btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
const openModal = () => {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
const closeModal = () => {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
export default Browse;