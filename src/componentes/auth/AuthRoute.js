import { Navigate } from 'react-router-dom';

const AuthRoute = ({ children, allowedRoles }) => {
    const role = localStorage.getItem('role');

    if (!role || !allowedRoles.includes(role)) {
        return <Navigate to="/login" />; 
    }

    return children; 
};

export default AuthRoute;
