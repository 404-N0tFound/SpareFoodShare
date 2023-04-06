import "../components/Theme.css";
import "./MyItems.css";
import ProfileFramework from "../components/ProfileFramework";
import Navbar from "../components/Navbar";
import AuthContext from "../AuthContext";
import Footer from "../components/Footer";

import {PureComponent} from "react";

class MyItems extends PureComponent{
    static contextType = AuthContext

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            loading: false,
            items: [],
            has_more: true,
            offset: 0,
            limit: 20,
            user: {},
            context: false,
            xYPosition: { x: 0, y: 0 },
            chosen: null,
            active_item: null,
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
        this.setState({loading: true, user: this.context.user}, async () => {
            const { offset, limit, user } = this.state;
            let response = await fetch(`http://127.0.0.1:8000/api/myitems/?limit=${limit}&offset=${offset}&user_id=${user.user_id}`, {
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

    handleClick = () => {
        this.setState({context: false});
    }

    showNav = (selectedItem, event) => {
        event.preventDefault();
        this.setState({context: false});
        const positionChange = {
            x: event.pageX,
            y: event.pageY,
        }
        this.setState({xYPosition: positionChange, active_item: selectedItem});
        this.setState({context: true});
    };

    hideContext = () => {
        this.setState({context: false});
    }

    initMenu = (chosen) => {
        this.setState({chosen: chosen});
        alert(chosen + " : " + this.state.active_item.name);
    }

    render() {
        return (
            <div className="page-content" onClick={this.handleClick}>
                <Navbar/>
                <body className="my_items-body">
                <ProfileFramework />
                <div className="my_items-content">
                    <ul>
                        {this.state.items && this.state.items.map((itemsObj) => (
                            <div key={itemsObj.id} className="my_items-card"  onContextMenu = {this.showNav.bind(this, itemsObj)}>
                                <li>
                                    <img className="my_items-pic" src={`http://127.0.0.1:8000${itemsObj.picture}`} />
                                    <div className="my_items_info">
                                        <h3>Name: {itemsObj.name}</h3>
                                        <p>Des: {itemsObj.description}</p><br />
                                        <p>Upload Date: { itemsObj.upload_date }</p>
                                        <p>Expiration Date: { itemsObj.expiration_date }</p>
                                        <p>Location: { itemsObj.location }</p>
                                    </div>
                                </li>
                            </div>
                            )
                        )}
                        {this.state.items.length === 0 &&
                            <div className="no_items_msg">
                                There are no items to display at this time.
                            </div>
                        }
                    </ul>
                </div>

                <div onClick={this.hideContext} className="contextContainer">
                    {this.state.context && (
                        <div
                            style={{ top: this.state.xYPosition.y, left: this.state.xYPosition.x }}
                            className="rightClick_menu"
                        >
                             <div className="menuElement" onClick={() => this.initMenu("Details")}>Details</div>
                             <div className="menuElement" onClick={() => this.initMenu("Delete")}>Delete</div>
                        </div>
                    )}
                </div>

                </body>
                <Footer id="foot_id"/>
            </div>
        );
    }

}

export default MyItems;