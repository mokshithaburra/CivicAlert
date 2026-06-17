import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
	FiFileText,
	FiPlus,
	FiLogOut,
	FiUser,
	FiShield,
	FiMapPin,
	FiAlignLeft,
	FiTag,
} from 'react-icons/fi';

export default function FileComplaint() {
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('Municipal');
	const [priority, setPriority] = useState('Medium');
	const [location, setLocation] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!user) {
			navigate('/login', { replace: true });
		}
	}, [navigate, user]);

	const handleLogout = () => {
		logout();
		navigate('/login', { replace: true });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			setIsLoading(true);
			const response = await api.post('/complaints', {
				title,
				description,
				category,
				priority,
				location,
			});

			const complaint = response?.data?.complaint || response?.data?.data || {};
			const trackingNumber = complaint?.trackingNumber || 'N/A';

			toast.success(`Complaint submitted successfully! Tracking: ${trackingNumber}`);
			navigate('/user/my-complaints', { replace: true });
		} catch (error) {
			const message =
				error?.response?.data?.message || error?.message || 'Unable to submit complaint';
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="main-content" style={{ marginLeft: 0 }}>
			<aside className="sidebar">
				<div className="sidebar-header">
					<FiShield size={28} color="var(--secondary)" />
					<h2 className="sidebar-logo">CivicAlert</h2>
				</div>

				<nav className="sidebar-nav">
					<Link to="/user/dashboard" className="sidebar-link">
						<FiUser size={18} />
						Dashboard
					</Link>
					<Link to="/user/file-complaint" className="sidebar-link active">
						<FiPlus size={18} />
						File Complaint
					</Link>
					<Link to="/user/my-complaints" className="sidebar-link">
						<FiFileText size={18} />
						My Complaints
					</Link>
				</nav>

				<div className="sidebar-footer">
					<button type="button" className="sidebar-link btn-danger" onClick={handleLogout}>
						<FiLogOut size={18} />
						Logout
					</button>
				</div>
			</aside>

			<div className="main-content" style={{ marginLeft: 260 }}>
				<div className="topbar">
					<span className="topbar-title">File a Complaint</span>
					<div className="topbar-user">
						<div className="user-avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
						<span>{user?.name || 'User'}</span>
					</div>
				</div>

				<div className="page-wrapper fade-in">
					<h1 className="page-title">File a Complaint</h1>
					<p>Fill in the details below to submit your complaint</p>

					<div className="card fade-in" style={{ maxWidth: '700px', margin: '2rem auto 0' }}>
						<form onSubmit={handleSubmit}>
							<div className="form-group">
								<label htmlFor="title">Title</label>
								<div style={{ position: 'relative' }}>
									<FiAlignLeft
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
										id="title"
										className="input-field"
										type="text"
										value={title}
										onChange={(event) => setTitle(event.target.value)}
										placeholder="Enter complaint title"
										style={{ paddingLeft: '2.75rem' }}
										required
									/>
								</div>
							</div>

							<div className="form-group">
								<label htmlFor="description">Description</label>
								<div style={{ position: 'relative' }}>
									<FiAlignLeft
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
										id="description"
										className="input-field"
										value={description}
										onChange={(event) => setDescription(event.target.value)}
										placeholder="Describe your complaint in detail"
										rows="4"
										style={{ paddingLeft: '2.75rem', resize: 'vertical' }}
										required
									/>
								</div>
							</div>

							<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
								<div className="form-group">
									<label htmlFor="category">Category</label>
									<div style={{ position: 'relative' }}>
										<FiTag
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
										<select
											id="category"
											className="input-field"
											value={category}
											onChange={(event) => setCategory(event.target.value)}
											style={{ paddingLeft: '2.75rem' }}
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
								</div>

								<div className="form-group">
									<label htmlFor="priority">Priority</label>
									<select
										id="priority"
										className="input-field"
										value={priority}
										onChange={(event) => setPriority(event.target.value)}
										required
									>
										<option value="Low">Low</option>
										<option value="Medium">Medium</option>
										<option value="High">High</option>
									</select>
								</div>
							</div>

							<div className="form-group">
								<label htmlFor="location">Location</label>
								<div style={{ position: 'relative' }}>
									<FiMapPin
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
										id="location"
										className="input-field"
										type="text"
										value={location}
										onChange={(event) => setLocation(event.target.value)}
										placeholder="Enter location"
										style={{ paddingLeft: '2.75rem' }}
										required
									/>
								</div>
							</div>

							<div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
								<button
									type="button"
									className="btn-outline"
									onClick={() => navigate('/user/dashboard')}
									style={{ flex: '1 1 160px' }}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="btn-primary"
									disabled={isLoading}
									style={{ flex: '1 1 220px' }}
								>
									{isLoading ? 'Submitting...' : 'Submit Complaint'}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}