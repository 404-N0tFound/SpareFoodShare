import PropTypes from 'prop-types';
import { Navigate } from "react-router-dom";
import {useContext} from "react";
import AuthContext from "../AuthContext";

function PrivateRouteLogin({ children }) {
    let {user} = useContext(AuthContext)
    return !user ? <>{children}</> : <Navigate to="/profile" />;
}

PrivateRouteLogin.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRouteLogin;