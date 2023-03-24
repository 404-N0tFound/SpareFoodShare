/* eslint-disable */
import { useState, useEffect } from 'react';
import {PureComponent} from "react";
import "./Browse.css";
import "../components/Theme.css";
import Navbar from "../components/Navbar";
import {useNavigate} from "react-router-dom";
import Footer from "../components/Footer";
import pic from "../pics/test.jpg"

class Browse extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            loading: false,
            items: [],
            has_more: true,
            offset: 0,
            limit: 20
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

    render() {
        return (
            <div className="page-content">
                <Navbar/>
                <body className="listings-body">
                <div className="listings-content">
                    <ul>
                        {this.state.items && this.state.items.map((itemsObj) => (
                            <div key={itemsObj.id} className="item-card">
                                <li>
                                    <img className="items-pic" src={ pic } />
                                    <div className="item_info">
                                        <h3>Name: {itemsObj.name}</h3>
                                        <p>Des: {itemsObj.description}</p>
                                        <p>Provider: { itemsObj.id }</p>
                                        <p>Location: { itemsObj.location }</p>
                                    </div>
                                    <button className="item_btn" onClick={() => btn_clicked( itemsObj.id )}>Details</button>
                                </li>
                            </div>
                            )
                        )}
                    </ul>
                </div>
                </body>
                <Footer id="foot_id"/>
            </div>
        )
    };
}

export default Browse;

/*

 */