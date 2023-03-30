import "../components/Theme.css";
import "./MyOrders.css";
import ProfileFramework from "../components/ProfileFramework";
import Navbar from "../components/Navbar";
import AuthContext from "../AuthContext";
import Footer from "../components/Footer";

import {PureComponent} from "react";

class MyOrders extends PureComponent{
    static contextType = AuthContext

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            loading: false,
            orders: [],
            has_more: true,
            offset: 0,
            limit: 20,
            user: {},
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
    }

    componentDidMount() {
        this.loadOrders()
    }

    loadOrders = () => {
        this.setState({loading: true, user: this.context.user}, async () => {
            const { offset, limit, user } = this.state;
            let response = await fetch(`http://127.0.0.1:8000/api/orders/?limit=${limit}&offset=${offset}&user_id=${user.user_id}`, {
                method:'GET'
            })
            let data = await response.json()
            if (response.status === 200) {
                const newOrders = data.orders;
                const has_more = data.has_more;
                this.setState({
                    has_more: has_more,
                    loading: false,
                    orders: [...this.state.orders, ...newOrders],
                    offset: offset + limit
                })
            } else {
                alert('Browse service failed! Is it maybe down?')
            }
        })
    }

    render() {
        return (
            <div className="page-content">
                <Navbar/>
                <body className="my_orders-body">
                <ProfileFramework />
                <div className="my_orders-content">
                    <ul>
                        {this.state.orders && this.state.orders.map((ordersObj) => (
                            <div key={ordersObj.id} className="my_orders-card">
                                <li>
                                    <div className="my_orders_info">
                                        <h3>Item Name: {ordersObj.item__name} </h3>
                                        <p>Create Date: {ordersObj.created_date}</p>
                                        <p>Initiator Email: {ordersObj.initiator__email}</p>
                                        <p>Pickup Location: {ordersObj.collection_location} </p>
                                        <p>Created Date: {ordersObj.created_date } </p>
                                        <p>Donation: ￡{ordersObj.donation_amount} </p>
                                        {ordersObj.is_collected && <p>Collect Date: {ordersObj.collect_date} </p>}
                                        {!ordersObj.is_collected && <p>Collect Date: Not Collected </p>}
                                    </div>
                                </li>
                            </div>
                            )
                        )}
                        {this.state.orders.length === 0 &&
                            <div className="no_orders_msg">
                                There are no orders to display at this time.
                            </div>
                        }
                    </ul>
                </div>
                </body>
                <Footer id="foot_id"/>
            </div>
        );
    }

}

export default MyOrders;