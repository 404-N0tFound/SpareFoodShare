import React from "react";
import ReactDOM from "react-dom/client";
import {} from "./index.css";
import Welcome from "./jsx/welcome/Welcome"
//import Listings from "./jsx/listings/Listings"
//import Browse from "./jsx/browse/Browse"
import reportWebVitals from "./reportWebVitals";
// import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById("root"));
//const mainRoute = [
//    {
//        pathname:'',
//        component: Welcome
//    }
//];
root.render(
        <React.StrictMode>
            <Welcome />
        </React.StrictMode>
//        <Router>
//            <Routes>
//                <Route path='' component={Welcome} />
//                <Route path='/list' component={Listings} />
//                <Route path='/browse' component={Browse} />
//                {
//                mainRoute.map( (route, key)=>{
//                    return <Route path={route.pathname} component={route.component} key={key}/>
//                })
//            }
//            <Navigate to='/home' from='/' exact/>
//            </Routes>
//        </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

