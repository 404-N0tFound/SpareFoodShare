import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {} from "./index.css";
import Layout from "./jsx/Layout";
import Welcome from "./jsx/welcome/Welcome";
import Browse from "./jsx/browse/Browse";
import Login from "./jsx/login/Login";
import reportWebVitals from "./reportWebVitals";
import Item from "./jsx/item/Item";
import Upload from "./jsx/upload/Upload";
import MyProfile from "./jsx/MyProfile/MyProfile";

export default function App() {
    return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Welcome />} />
                        <Route path="browse" element={<Browse />} />
                        <Route path="login" element={<Login />} />
                        <Route path="item/:item_id" element={<Item />} />
                        <Route path="upload" element={<Upload />} />
                        <Route path="profile" element={<MyProfile />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

