import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

function PrivateRoute({ children, roles = [] }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!user || !token) {
    // Redirect to login but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    // If role is specified but user doesn't have it, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
};

export default PrivateRoute; 