import {useContext} from "react";
import AuthContext from "../AuthContext";
import {Navigate} from "react-router-dom";
import PropTypes from "prop-types";

function PrivateRouteProfile({ children }) {
    let {user} = useContext(AuthContext)
    return (user && !user.is_admin) ? <>{children}</> : <Navigate to="/login" />;
}

PrivateRouteProfile.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRouteProfile;