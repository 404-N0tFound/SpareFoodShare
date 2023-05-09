import {PureComponent} from "react";
import "./Browse.css";
import "../components/Theme.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {useLocation, useNavigate} from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import PropTypes from 'prop-types';

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
            active_item: null,
            reload: false,
            show: false,
            success: false,
            CLIENT_ID: process.env.REACT_APP_CLIENT_ID, // eslint-disable-line
            donation_amount: 0
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
        this.loadItems();
        const uuid = new URLSearchParams(location.search).get("uuid");
        if (uuid) {
            this.populateModalSingle(uuid);
        }
    }

    populateModalSingle = async (uuid) => {
        let jwt = 0;
        try {
            jwt = JSON.parse(localStorage.getItem('authTokens')).access;
            /* eslint-disable no-empty */
        } catch (ignored) {}
        /* eslint-enable */
        let response = await fetch(`http://127.0.0.1:8000/api/item/?uuid=${uuid}&jwt=${jwt}`, {
            method:'GET'
        })
        let data = await response.json();
        if (response.status === 200) {
            this.setState({
                active_item: data
            });
            const modal = document.getElementById("myModal");
            modal.style.display = "block";
            const newUrl = `${window.location.origin}${window.location.pathname}`;
            window.history.pushState({}, "", newUrl);
        } else {
            alert("Invalid share link!");
        }
    }

    loadItems = () => {
        this.setState({loading: true}, async () => {
            const { offset, limit } = this.state;
            let jwt = 0;
            try {
                jwt = JSON.parse(localStorage.getItem('authTokens')).access;
                /* eslint-disable no-empty */
            } catch (ignored) {}
            /* eslint-enable */
            let response = await fetch(`http://127.0.0.1:8000/api/items/?limit=${limit}&offset=${offset}&jwt=${jwt}`, {
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
                alert('Browse service failed! Is it maybe down?');
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

    shareItem = async () => {
        let response = await fetch(`http://127.0.0.1:8000/api/item/share/${this.state.active_item.id}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
        await response.json();
        if (response.status === 200) {
            navigator.clipboard.writeText(`${window.location.origin}${location.pathname}/?uuid=${this.state.active_item.id}`).then(() => alert("Copied link to clipboard!"));
        } else {
            alert("Could not generate a share link! Is the service maybe down?");
        }
    }

    registerInterest = async () => {
        try {
            JSON.parse(localStorage.getItem('authTokens')).access;
        } catch (Exception) {
            alert("You must sign in before you can register interest in an item!");
            return;
        }
        if(this.state.donation_amount == 0)
            await this.createOrder();
        else
            this.setState({show: true});
    }

    createOrder = async() => {
        let jwt = JSON.parse(localStorage.getItem('authTokens')).access;
        const orderDetails = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                item: this.state.active_item.id,
                initiator: jwt,
                donation_amount: this.state.donation_amount
            })}
        console.log(jwt);
        let response = await fetch('http://127.0.0.1:8000/api/orders/create/', orderDetails);
        await response.json()
        if (response.status === 200 || response.status === 201) {
            alert("You order has been created!")
            this.props.navigate(0);
            window.location.reload(false);
        } else if (response.status === 400) {
            alert("You must sign in before you can register interest in an item!")
        } else {
            alert("Failed to create order, is the service maybe down?")
        }
    }


    handleFilterChange = (e) => {
        if(e.target.value == 'upload_date'){
            this.setState({items: this.state.items.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date))});
        }else if(e.target.value == 'expiration_date'){
            this.setState({items: this.state.items.sort((a, b) => new Date(a.expiration_date) - new Date(b.expiration_date))});
        }
        this.setState(
              {reload: true},
                () => this.setState({reload: false})
        )
    }


    onApprove = (data, actions) => {
        this.setState({success: true});
        this.createOrder();
        return actions.order.capture();
    };

    render() {
        return (
            <div className="page-content">
                <Navbar/>
                <body className="listings-body">
                <div className="items-filter">
                    <select id="select-option" name="select-option" onChange={this.handleFilterChange} defaultValue="default">
                        <option style ={{backgroundImage: 'url(' + require('../pics/sort.jpg') +')'} } value="default" disabled>Sort By</option>
                        <option value="upload_date">Upload Date</option>
                        <option value="expiration_date">Expiration Date</option>
                    </select>
                </div>

                <div className="listings-content">
                    <ul>
                        {this.state.items && this.state.items.map((itemsObj) => (
                            <div key={itemsObj.id}>
                                <li>
                                    <a className="item-card" id="myBtn" onClick={() => this.openModal(itemsObj)}>
                                        <img className="items-pic" src={`http://127.0.0.1:8000${itemsObj.picture}`} />
                                        <h1>{itemsObj.name}</h1>
                                        <p>Expiry Date: {itemsObj.expiration_date}</p>
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
                        <PayPalScriptProvider options={{ "client-id": this.state.CLIENT_ID }}>
                            <div>
                                <img className="items-pic" src={`http://127.0.0.1:8000${this.state.active_item.picture}`} />
                                <h2>{this.state.active_item.name}</h2>
                                <p><b>Description:</b> {this.state.active_item.description}</p>
                                <p><b>Upload Date:</b> { this.state.active_item.upload_date }</p>
                                <p><b>Expiry Date:</b> {this.state.active_item.expiration_date}</p>
                                <p><b>Location</b>: {this.state.active_item.location}</p>
                                <p><b>Donations:</b><input type="number" onChange={ (e) => this.setState({donation_amount: e.target.value}) } placeholder="0~10" min="0" max="10"/></p>
                                <button className="modal-button" onClick={this.shareItem}>Share</button>
                                { this.state.active_item.is_registrable ? <button className="modal-button" onClick={this.registerInterest}>Register Interest</button> : null }
                                {this.state.show ? (
                                <p>
                                    <PayPalButtons
                                        style={{ layout: "vertical" }}
                                        createOrder={this.createPaymentOrder}
                                        onApprove={this.onApprove}
                                    />
                                </p>) : null}
                            </div>
                            </PayPalScriptProvider>
                        : <p>No item selected</p> }
                    </div>
                </div>
                </body>
                <Footer id="foot_id"/>
            </div>
        )
    }
}

/* eslint-disable react/display-name */
const Browse = (Component) => {
    return (props) => {
        const navigate = useNavigate();
        const location = useLocation();
        return <Component navigate={navigate} location={location} {...props} />
    }
}
/* eslint-enable */

BrowseScreen.propTypes = {
    navigate: PropTypes.any.isRequired,
    location: PropTypes.any.isRequired,
};

export default Browse(BrowseScreen);
