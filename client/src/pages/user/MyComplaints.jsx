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
	FiRefreshCw,
} from 'react-icons/fi';

export default function MyComplaints() {
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const [complaints, setComplaints] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [activeFilter, setActiveFilter] = useState('All');

	const fetchComplaints = async () => {
		try {
			setIsLoading(true);
			const response = await api.get('/complaints/my-complaints');
			const complaintList =
				response?.data?.complaints || response?.data?.data?.complaints || [];
			setComplaints(Array.isArray(complaintList) ? complaintList : []);
		} catch (error) {
			const message =
				error?.response?.data?.message || error?.message || 'Failed to load complaints';
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchComplaints();
	}, []);

	const handleLogout = () => {
		logout();
		navigate('/login', { replace: true });
	};

	const getStatusClass = (status = '') => {
		switch (status.toLowerCase()) {
			case 'pending':
				return 'badge-pending';
			case 'assigned':
				return 'badge-assigned';
			case 'in progress':
			case 'inprogress':
				return 'badge-inprogress';
			case 'resolved':
				return 'badge-resolved';
			case 'closed':
				return 'badge-closed';
			default:
				return 'badge-closed';
		}
	};

	const getPriorityClass = (priority = '') => {
		switch (priority.toLowerCase()) {
			case 'high':
				return 'badge-high';
			case 'medium':
				return 'badge-medium';
			case 'low':
				return 'badge-low';
			default:
				return 'badge-low';
		}
	};

	const formatDate = (dateValue) => {
		if (!dateValue) return '-';
		return new Date(dateValue).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	const filteredComplaints =
		activeFilter === 'All'
			? complaints
			: complaints.filter(
					(complaint) =>
						complaint.status?.toLowerCase() === activeFilter.toLowerCase()
				);

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
					<Link to="/user/file-complaint" className="sidebar-link">
						<FiPlus size={18} />
						File Complaint
					</Link>
					<Link to="/user/my-complaints" className="sidebar-link active">
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
					<span className="topbar-title">My Complaints</span>
					<div className="topbar-user">
						<div className="user-avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
						<span>{user?.name || 'User'}</span>
					</div>
				</div>

				<div className="page-wrapper fade-in">
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
						<h1 className="page-title">My Complaints</h1>
						<div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
							<button type="button" className="btn-outline" onClick={fetchComplaints} disabled={isLoading}>
								<FiRefreshCw size={16} /> Refresh
							</button>
							<Link to="/user/file-complaint" className="btn-primary">
								+ New Complaint
							</Link>
						</div>
					</div>

					<div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', margin: '1.25rem 0 1.5rem' }}>
						{['All', 'Pending', 'Resolved'].map((filter) => (
							<button
								key={filter}
								type="button"
								className={activeFilter === filter ? 'btn-primary' : 'btn-outline'}
								onClick={() => setActiveFilter(filter)}
							>
								{filter}
							</button>
						))}
					</div>

					{isLoading ? (
						<div className="empty-state fade-in">
							<div className="empty-state-icon">⏳</div>
							<h3>Loading complaints...</h3>
						</div>
					) : filteredComplaints.length === 0 ? (
						<div className="empty-state fade-in">
							<div className="empty-state-icon">📭</div>
							<h3>No complaints found</h3>
							<p>
								{activeFilter === 'All'
									? 'You have not submitted any complaints yet.'
									: `No complaints match the ${activeFilter.toLowerCase()} filter.`}
							</p>
						</div>
					) : (
						<div style={{ display: 'grid', gap: '1rem' }}>
							{filteredComplaints.map((complaint) => (
								<div key={complaint._id} className="complaint-card fade-in">
									<div className="complaint-card-header">
										<div>
											<div className="complaint-card-title">{complaint.title || '-'}</div>
										</div>
										<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
											<span className={getStatusClass(complaint.status)}>{complaint.status || '-'}</span>
											<span className={getPriorityClass(complaint.priority)}>{complaint.priority || '-'}</span>
										</div>
									</div>

									<p style={{ color: 'var(--gray)', marginBottom: '1rem' }}>
										{(complaint.description || '-').length > 100
											? `${complaint.description.slice(0, 100)}...`
											: complaint.description || '-'}
									</p>

									<div className="complaint-card-meta">
										<span>🎫 {complaint.trackingNumber || '-'}</span>
										<span>📁 {complaint.category || '-'}</span>
										<span>📍 {complaint.location || '-'}</span>
										<span>📅 {formatDate(complaint.createdAt)}</span>
									</div>

									{Array.isArray(complaint.actionNotes) && complaint.actionNotes.length > 0 && (
										<div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
											<strong>Latest Update:</strong>{' '}
											<span style={{ color: 'var(--gray)', fontStyle: 'italic' }}>
												{complaint.actionNotes[complaint.actionNotes.length - 1]}
											</span>
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}