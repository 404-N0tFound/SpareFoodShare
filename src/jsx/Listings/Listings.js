

function Listings(){
    return (
        <div className="listings-page">
            <header className="listings-header">
                <p>Listings</p>
            </header>
            <body className="listings-body">
                <div className="listings-table">
                    <table id="listings-table">
                        <tr>
                            <th>id</th>
                            <th>Name</th>
                            <th>Des</th>
                            <th>Provider</th>
                            <th>Status</th>
                        </tr>
                    </table>
                </div>
            </body>
        </div>
    );
}

export default Listings;