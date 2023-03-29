/* eslint-disable */
import {PureComponent} from "react";
import "./Browse.css";
import "../components/Theme.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import jwtDecode from "jwt-decode";
import {useNavigate, useParams} from 'react-router-dom';

class BrowseScreen extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            loading: false,
            items: [],
            has_more: true,
            offset: 0,
            limit: 20,
            active_item: null
        };

        window.onscroll = () => {
            const {
                state: {error, loading, has_more}
            } = this;
            if (error || loading || !has_more) return;
            var changeHeight = document.documentElement.scrollHeight - document.documentElement.scrollTop;
            // TODO we need to look at getting the height of the footer instead of a hard coded 100 for now
            var difference = document.documentElement.clientHeight + 100;
            if (changeHeight <= difference) {
                this.loadItems();
            }
        }

        window.onclick = function(event) {
            const modal = document.getElementById("myModal");
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    componentDidMount() {
        this.loadItems()
    }

    loadItems = () => {
        this.setState({loading: true}, async () => {
            const { offset, limit } = this.state;
            let response = await fetch(`http://127.0.0.1:8000/api/items/?limit=${limit}&offset=${offset}`, {
                method:'GET'
            })
            let data = await response.json()
            if (response.status === 200) {
                const newItems = data.items;
                const has_more = data.has_more;
                this.setState({
                    has_more: has_more,
                    loading: false,
                    items: [...this.state.items, ...newItems],
                    offset: offset + limit
                })
            } else {
                alert('Browse service failed! Is it maybe down?')
            }
        })
    }

    openModal = (selectedItem) => {
        this.setState({
            active_item: selectedItem
        });
        const modal = document.getElementById("myModal");
        modal.style.display = "block";
    }

    closeModal = () => {
        const modal = document.getElementById("myModal");
        modal.style.display = "none";
    }

    registerInterest = async () => {
        const user_id = jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access).user_id;
        const orderDetails = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item: this.state.active_item.id, initiator: user_id,
                donation_amount: 0.00})}
        let response = await fetch('http://127.0.0.1:8000/api/orders/create/', orderDetails);
        await response.json()
        alert("You order has been created!")
        this.props.navigation('../')
    }

    render() {
        return (
            <div className="page-content">
                <Navbar/>
                <body className="listings-body">
                <div className="listings-content">
                    <ul>
                        {this.state.items && this.state.items.map((itemsObj) => (
                            <div key={itemsObj.id}>
                                <li>
                                    <a className="item-card" id="myBtn" onClick={() => this.openModal(itemsObj)}>
                                        <img className="items-pic" src={`http://127.0.0.1:8000${itemsObj.picture}`} />
                                        <h1>{itemsObj.name}</h1>
                                        <p>Expiry Date: {itemsObj.expiration_date}</p>
                                        <p><button>Register Interest</button></p>
                                    </a>
                                </li>
                            </div>
                            )
                        )}
                        {this.state.items.length === 0 &&
                            <div>
                                There are no items to display at this time.
                            </div>
                        }
                    </ul>
                </div>
                <div className="modal" id="myModal">
                    <div className="modal-content">
                        <span onClick={this.closeModal} className="close">&times;</span>
                        {this.state.active_item != null ?
                            <div>
                                <img className="items-pic" src={`http://127.0.0.1:8000${this.state.active_item.picture}`} />
                                <h1>{this.state.active_item.name}</h1>
                                <p>Description: {this.state.active_item.description}</p>
                                <p>Location: {this.state.active_item.location}</p>
                                <p>Expiry Date: {this.state.active_item.expiration_date}</p>
                                <p><button onClick={this.registerInterest}>Register Interest</button></p>
                            </div>
                        : <p>No item selected</p> }
                    </div>
                </div>
                </body>
                <Footer id="foot_id"/>
            </div>
        )
    }
}

const Browse = (Component) => {
    return (props) => {
        const navigation = useNavigate();
        return <Component navigation={navigation} {...props} />
    }
}

export default Browse(BrowseScreen);
