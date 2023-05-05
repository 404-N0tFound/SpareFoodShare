import {useContext} from "react";
import AuthContext from "../AuthContext";
import {Navigate} from "react-router-dom";
import PropTypes from "prop-types";

function PrivateRouteAdmin({ children }) {
    let {user} = useContext(AuthContext)
    return (user && user.is_admin) ? <>{children}</> : <Navigate to="/login" />;
}

PrivateRouteAdmin.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRouteAdmin;