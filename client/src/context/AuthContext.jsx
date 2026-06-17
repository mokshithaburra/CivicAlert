import { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem('token') || null);
	const [isLoading, setIsLoading] = useState(true);

	const login = (userData, tokenValue) => {
		localStorage.setItem('token', tokenValue);
		setUser(userData);
		setToken(tokenValue);
	};

	const logout = () => {
		localStorage.removeItem('token');
		setUser(null);
		setToken(null);
	};

	useEffect(() => {
		const loadProfile = async () => {
			if (!token) {
				setIsLoading(false);
				return;
			}

			try {
				const response = await fetch('http://localhost:5000/api/auth/profile', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error('Failed to load profile');
				}

				const data = await response.json();
				setUser(data.user || data);
			} catch (error) {
				logout();
			} finally {
				setIsLoading(false);
			}
		};

		loadProfile();
	}, [token]);

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				login,
				logout,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
