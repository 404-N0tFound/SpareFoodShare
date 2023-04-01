import "../components/Theme.css";
import "./MySales.css";
import ProfileFramework from "../components/ProfileFramework";
import Navbar from "../components/Navbar";
import AuthContext from "../AuthContext";
import Footer from "../components/Footer";

import {PureComponent} from "react";

class MySales extends PureComponent{
    static contextType = AuthContext

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            loading: false,
            sales: [],
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
        this.loadSales()
    }

    loadSales = () => {
        this.setState({loading: true, user: this.context.user}, async () => {
            const { offset, limit, user } = this.state;
            let response = await fetch(`http://127.0.0.1:8000/api/sales/?limit=${limit}&offset=${offset}&user_id=${user.user_id}`, {
                method:'GET'
            })
            let data = await response.json()
            if (response.status === 200) {
                const newSales = data.sales;
                const has_more = data.has_more;
                this.setState({
                    has_more: has_more,
                    loading: false,
                    sales: [...this.state.sales, ...newSales],
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
                <body className="my_sales-body">
                <ProfileFramework />
                <div className="my_sales-content">
                    <ul>
                        {this.state.sales && this.state.sales.map((salesObj) => (
                            <div key={salesObj.id} className="my_sales-card">
                                <li>
                                    <div className="my_sales_info">
                                        <h3>Item Name: {salesObj.item__name} </h3>
                                        <p>Create Date: {salesObj.created_date}</p>
                                        <p>Initiator Email: {salesObj.initiator__email}</p>
                                        <p>Pickup Location: {salesObj.collection_location} </p>
                                        <p>Created Date: {salesObj.created_date } </p>
                                        <p>Donation: ￡{salesObj.donation_amount} </p>
                                        {salesObj.is_collected && <p>Collect Date: {salesObj.collect_date} </p>}
                                        {!salesObj.is_collected && <p>Collect Date: Not Collected </p>}
                                    </div>
                                </li>
                            </div>
                            )
                        )}
                        {this.state.sales.length === 0 &&
                            <div className="no_sales_msg">
                                There are no sales to display at this time.
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

export default MySales;