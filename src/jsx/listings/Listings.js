import { useState, useEffect } from 'react'

function Listings(){

    const [user, setUser] = useState([]);

  const fetchData = () => {
    return fetch('../items/')
          .then((response) => response.json())
          .then((data) => console.log(data))
          .then((data) => setUser(data));
  }
  useEffect(() => {
    fetchData()
  },[])
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
                        {user && user.length > 0 && user.map((userObj) => (
                            <tr key={userObj.id}>{userObj.item_name}</tr>
                        ))}
                    </table>
                </div>
            </body>
        </div>
    );
}

export default Listings;