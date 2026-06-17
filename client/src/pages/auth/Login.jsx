import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiShield } from 'react-icons/fi';

export default function Login() {
	const navigate = useNavigate();
	const { user, token, login, isLoading } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (isLoading || !user || !token) {
			return;
		}

		const dashboardByRole = {
			USER: '/user/dashboard',
			AGENT: '/agent/dashboard',
			ADMIN: '/admin/dashboard',
		};

		const redirectTo = dashboardByRole[user.role];
		if (redirectTo) {
			navigate(redirectTo, { replace: true });
		}
	}, [isLoading, navigate, token, user]);

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			setSubmitting(true);
			const response = await api.post('/auth/login', { email, password });
			const { user: userData, token: tokenValue } = response.data;

			login(userData, tokenValue);

			const dashboardByRole = {
				USER: '/user/dashboard',
				AGENT: '/agent/dashboard',
				ADMIN: '/admin/dashboard',
			};

			navigate(dashboardByRole[userData.role] || '/login', { replace: true });
		} catch (error) {
			const message =
				error?.response?.data?.message || error?.message || 'Unable to sign in';
			toast.error(message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="auth-page">
			<div className="auth-card fade-in">
				<div className="auth-logo">
					<div
						style={{
							width: 64,
							height: 64,
							borderRadius: '50%',
							background: 'rgba(230, 57, 70, 0.1)',
							display: 'inline-flex',
							alignItems: 'center',
							justifyContent: 'center',
							marginBottom: '1rem',
						}}
					>
						<FiShield size={40} color="var(--primary)" />
					</div>
					<h1>CivicAlert</h1>
					<p>Online Complaint Registration System</p>
				</div>

				<h2 className="auth-title">Welcome Back</h2>
				<p className="auth-subtitle">Sign in to your account to continue</p>

				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="email">Email</label>
						<div style={{ position: 'relative' }}>
							<FiMail
								size={18}
								color="var(--gray)"
								style={{
									position: 'absolute',
									left: '1rem',
									top: '50%',
									transform: 'translateY(-50%)',
									pointerEvents: 'none',
								}}
							/>
							<input
								id="email"
								className="input-field"
								type="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								placeholder="Enter your email"
								style={{ paddingLeft: '2.75rem' }}
								required
							/>
						</div>
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<div style={{ position: 'relative' }}>
							<FiLock
								size={18}
								color="var(--gray)"
								style={{
									position: 'absolute',
									left: '1rem',
									top: '50%',
									transform: 'translateY(-50%)',
									pointerEvents: 'none',
								}}
							/>
							<input
								id="password"
								className="input-field"
								type="password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								placeholder="Enter your password"
								style={{ paddingLeft: '2.75rem' }}
								required
							/>
						</div>
					</div>

					<button
						type="submit"
						className="btn-primary"
						style={{ width: '100%' }}
						disabled={submitting}
					>
						{submitting ? 'Signing in...' : 'Sign In'}
					</button>
				</form>

				<div className="auth-footer">
					Don&apos;t have an account?{' '}
					<Link to="/register">Register here</Link>
				</div>
			</div>
		</div>
	);
}