import { useState, useEffect } from 'react'

function Listings(){

    const [name, setName] = useState([]);
    const names = async() => {
        const response = await fetch('./items');
        setName(await response.json())
    }

    useEffect(() => {
        names()
    }, []
    )

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
                        <tr>
                            {name.map((data) => {
                                return(
                                    console.log("123")
                                    <td>{data.id}</td>
                                    )}
                            )}
                    </table>
                </div>
            </body>
        </div>
    );
}

export default Listings;