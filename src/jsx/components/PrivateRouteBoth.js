import {useContext} from "react";
import AuthContext from "../AuthContext";
import {Navigate} from "react-router-dom";
import PropTypes from "prop-types";

function PrivateRouteBoth({ children }) {
    let {user} = useContext(AuthContext)
    return user ? <>{children}</> : <Navigate to="/login" />;
}

PrivateRouteBoth.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRouteBoth;