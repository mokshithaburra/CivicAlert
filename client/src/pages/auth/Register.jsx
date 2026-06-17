import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
	FiUser,
	FiMail,
	FiLock,
	FiPhone,
	FiMapPin,
	FiShield,
	FiBriefcase,
} from 'react-icons/fi';

export default function Register() {
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');
	const [department, setDepartment] = useState('Municipal');
	const [role, setRole] = useState('USER');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			setIsLoading(true);

			if (role === 'USER') {
				await api.post('/auth/register', {
					name,
					email,
					password,
					phone,
					address,
				});

				toast.success('Account created! Please login');
			} else {
				await api.post('/auth/register-agent', {
					name,
					email,
					password,
					phone,
					address,
					department,
				});

				toast.success('Agent registration submitted! Awaiting admin approval.');
			}

			navigate('/login');
		} catch (error) {
			const message =
				error?.response?.data?.message || error?.message || 'Unable to register';
			toast.error(message);
		} finally {
			setIsLoading(false);
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

				<h2 className="auth-title">Create Account</h2>
				<p className="auth-subtitle">Register to file and track complaints</p>

				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
					<button
						type="button"
						className={role === 'USER' ? 'btn-primary' : 'btn-outline'}
						onClick={() => setRole('USER')}
						style={{ width: '100%' }}
					>
						<FiUser size={16} /> Citizen
					</button>
					<button
						type="button"
						className={role === 'AGENT' ? 'btn-primary' : 'btn-outline'}
						onClick={() => setRole('AGENT')}
						style={{ width: '100%' }}
					>
						<FiBriefcase size={16} /> Agent
					</button>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="name">Name</label>
						<div style={{ position: 'relative' }}>
							<FiUser
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
								id="name"
								className="input-field"
								type="text"
								value={name}
								onChange={(event) => setName(event.target.value)}
								placeholder="Enter your full name"
								style={{ paddingLeft: '2.75rem' }}
								required
							/>
						</div>
					</div>

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
								placeholder="Create a password"
								style={{ paddingLeft: '2.75rem' }}
								required
							/>
						</div>
					</div>

					<div className="form-group">
						<label htmlFor="phone">Phone</label>
						<div style={{ position: 'relative' }}>
							<FiPhone
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
								id="phone"
								className="input-field"
								type="tel"
								value={phone}
								onChange={(event) => setPhone(event.target.value)}
								placeholder="Enter your phone number"
								style={{ paddingLeft: '2.75rem' }}
								required
							/>
						</div>
					</div>

					<div className="form-group">
						<label htmlFor="address">Address</label>
						<div style={{ position: 'relative' }}>
							<FiMapPin
								size={18}
								color="var(--gray)"
								style={{
									position: 'absolute',
									left: '1rem',
									top: '1rem',
									pointerEvents: 'none',
								}}
							/>
							<textarea
								id="address"
								className="input-field"
								value={address}
								onChange={(event) => setAddress(event.target.value)}
								placeholder="Enter your address"
								rows="3"
								style={{ paddingLeft: '2.75rem', resize: 'vertical' }}
								required
							/>
						</div>
					</div>

					{role === 'AGENT' && (
						<div className="form-group fade-in">
							<label htmlFor="department">Department</label>
							<select
								id="department"
								className="input-field"
								value={department}
								onChange={(event) => setDepartment(event.target.value)}
								required
							>
								<option value="Municipal">Municipal</option>
								<option value="Electricity">Electricity</option>
								<option value="Police">Police</option>
								<option value="Water">Water</option>
								<option value="Roads">Roads</option>
								<option value="Other">Other</option>
							</select>
						</div>
					)}

					<button
						type="submit"
						className="btn-primary"
						style={{ width: '100%' }}
						disabled={isLoading}
					>
						{isLoading ? 'Registering...' : 'Register'}
					</button>
				</form>

				<div className="auth-footer">
					Already have an account? <Link to="/login">Sign in</Link>
				</div>
			</div>
		</div>
	);
}