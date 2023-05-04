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
            context: false,
            xYPosition: { x: 0, y: 0 },
            chosen: null,
            active_item: null,
            edit_item: null,
            delete_item: null,
            anyChanges: false,
            reload: false,
            show: false,
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
            const jwt = JSON.parse(localStorage.getItem('authTokens')).access;
            let response = await fetch(`http://127.0.0.1:8000/api/myitems/?limit=${limit}&offset=${offset}&jwt=${jwt}`, {
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
        this.setState({
                chosen: chosen,
        });
        if(chosen=="Edit"){
            this.setState({edit_item: this.state.active_item});
            const dialog = document.getElementById("myitems-edit-div");
            dialog.style.display = "block";
        }else if(chosen=="Delete"){
            this.setState({delete_item: this.state.active_item}, () => {
                this.deleteItem();
            });
        }
    }

    modalOperations = (chosen) => {
        this.closeModal();
        this.initMenu(chosen);
    }


    closeDialog = () => {
        if(this.state.anyChanges){
            if(confirm("You have unsaved changes, do you still want to quit?")){
                const modal = document.getElementById("myitems-edit-div");
                modal.style.display = "none";
                window.location.reload(false);
            }
        }else{
                const modal = document.getElementById("myitems-edit-div");
                modal.style.display = "none";
        }
    }

    handleChange = () => {
        this.setState({anyChanges: true});
    }

    deleteItem = async() => {
        if(confirm("Are you sure that you want to delete Item : " + this.state.delete_item.name)){
            let response = await fetch('http://127.0.0.1:8000/api/item_operations/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'id': this.state.delete_item.id, 'operation': 'delete'})
            })
            if(response.status === 200)
                    window.location.reload(false);
            }
    }

    saveItemChanges = async(e) => {
        let item_name = e.target[0].value;
        let item_des = e.target[1].value;
        let item_location = e.target[2].value;
        let item_expiration_date = e.target[3].value;
        if(this.state.anyChanges){
            let response = await fetch('http://127.0.0.1:8000/api/item_operations/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'id': this.state.edit_item.id,
                                        'name': item_name,
                                        "des": item_des,
                                        "location": item_location,
                                        "expiration_date": item_expiration_date,
                                        "operation": "update",
                                        })
            })
            if(response.status === 200)
                console.log("Update Successfully :)");
            }else
                alert("No changes");
        e.preventDefault();
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

    openModal = (selectedItem) => {
        this.setState({
            active_item: selectedItem,
            show: true,
        });
        const modal = document.getElementById("myModal");
        modal.style.display = "block";
    }

    closeModal = () => {
        const modal = document.getElementById("myModal");
        modal.style.display = "none";
    }

    render() {
        return (
            <div className="page-content" onClick={this.handleClick}>
                <Navbar/>
                <body className="my_items-body">
                <ProfileFramework />
                <div className="my_items-filter">
                    <select onChange={this.handleFilterChange}  id="filter" defaultValue="default">
                        <option value="default" disabled>None</option>
                        <option value="upload_date">Upload Date</option>
                        <option value="expiration_date">Expiration Date</option>
                    </select>
                </div>
                <div className="my_items-content">
                    <ul>
                        {this.state.items && this.state.items.map((itemsObj) => (
                            <a key={itemsObj.id} className="my_items-card" onClick = {() => this.openModal(itemsObj)} onContextMenu = {this.showNav.bind(this, itemsObj)}>
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
                            </a>
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
                             <div className="menuElement" onClick={() => this.initMenu("Edit")}>Details</div>
                             <div className="menuElement" onClick={() => this.initMenu("Delete")}>Delete</div>
                        </div>
                    )}
                </div>

                <div className="myitems-edit" id="myitems-edit-div">
                    <div className="myitems-edit-content">
                        <span onClick={this.closeDialog} className="close-dialog">&times;</span>
                            {this.state.active_item != null & this.state.edit_item != null ?
                                <div className="myitems-edit-form">
                                    <form onSubmit={this.saveItemChanges}>
                                        <div className="form-group">
                                            <label className="item-form-label">Name: </label>
                                            <input name="item-name" className="form-style" defaultValue={this.state.edit_item.name} onChange={this.handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="item-form-label">Des: </label>
                                            <input name="item-description" className="form-style" defaultValue={this.state.edit_item.description} onChange={this.handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="item-form-label">Location: </label>
                                            <input name="item-location" className="form-style" defaultValue={this.state.edit_item.location} onChange={this.handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="item-form-label">Expiration Date: </label>
                                            <input name="item-expiration_date" type="date" className="form-style" defaultValue={this.state.edit_item.expiration_date} onChange={this.handleChange} />
                                        </div><br />
                                        <button className="myitems-edit-submit">Save</button>
                                    </form>
                                </div>
                            :<p></p>}
                    </div>
                </div>

                <div className="modal" id="myModal">
                    <div className="modal-content">
                        <span onClick={this.closeModal} className="close">&times;</span>
                        {this.state.active_item != null && this.state.show == true?
                            <div>
                                <div className="my_items_info">
                                    <h3>Name: {this.state.active_item.name}</h3>
                                    <p>Des: {this.state.active_item.description}</p><br />
                                    <p>Upload Date: { this.state.active_item.upload_date }</p>
                                    <p>Expiration Date: { this.state.active_item.expiration_date }</p>
                                    <p>Location: { this.state.active_item.location }</p>
                                    <button className="myitems-modal-btns" onClick = {() => this.modalOperations("Edit")}>Edit</button>
                                    <button className="myitems-modal-btns" onClick = {() => this.modalOperations("Delete")}>Delete</button>
                                </div>
                            </div>
                        : <p>No item selected</p> }
                    </div>
                </div>
                </body>
                <Footer id="foot_id"/>
            </div>
        );
    }

}

export default MyItems;