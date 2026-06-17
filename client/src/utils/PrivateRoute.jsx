import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ element, roles = [] }) {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (roles.length > 0 && !roles.includes(user.role)) {
		return <Navigate to="/login" replace />;
	}

	return element;
}
