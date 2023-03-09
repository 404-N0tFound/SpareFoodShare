

function Orders() {

    return (
        <div className="page-content">
            <div className="order-body">
                This is order preview :)
                <h2>Creating A Order</h2>
                <form className="order-form">
                    <label>Order Item Name: </label>
                    <input type="text" name="order_item_name" id="order_item_name"/>
                    <br />
                </form>
            </div>
        </div>

    );
}


export default Orders;