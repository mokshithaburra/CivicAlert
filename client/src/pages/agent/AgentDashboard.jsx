import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
	FiShield,
	FiList,
	FiLogOut,
	FiHome,
	FiClock,
	FiCheckCircle,
	FiAlertCircle,
	FiFileText,
} from 'react-icons/fi';

export default function AgentDashboard() {
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const [complaints, setComplaints] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchComplaints = async () => {
			try {
				setIsLoading(true);
				const response = await api.get('/agent/complaints');
				const complaintList =
					response?.data?.data || response?.data?.complaints || [];
				setComplaints(Array.isArray(complaintList) ? complaintList : []);
			} catch (error) {
				const message =
					error?.response?.data?.message || error?.message || 'Failed to load assigned complaints';
				toast.error(message);
			} finally {
				setIsLoading(false);
			}
		};

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

	const totalAssigned = complaints.length;
	const assignedCount = complaints.filter((item) => item.status === 'Assigned').length;
	const inProgressCount = complaints.filter((item) => item.status === 'In Progress').length;
	const resolvedCount = complaints.filter((item) => item.status === 'Resolved').length;

	const recentComplaints = complaints.slice(0, 5);

	return (
		<div className="main-content" style={{ marginLeft: 0 }}>
			<aside className="sidebar">
				<div className="sidebar-header">
					<FiShield size={28} color="var(--secondary)" />
					<h2 className="sidebar-logo">CivicAlert</h2>
				</div>

				<nav className="sidebar-nav">
					<Link to="/agent/dashboard" className="sidebar-link active">
						<FiHome size={18} />
						Dashboard
					</Link>
					<Link to="/agent/complaints" className="sidebar-link">
						<FiList size={18} />
						Assigned Complaints
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
					<span className="topbar-title">Agent Dashboard</span>
					<div className="topbar-user">
						<div className="user-avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'A'}</div>
						<span>{user?.name || 'Agent'}</span>
					</div>
				</div>

				<div className="page-wrapper fade-in">
					<h1 className="page-title">Agent Dashboard</h1>
					<p>Manage your assigned complaints</p>

					<div className="stats-grid" style={{ marginTop: '1.5rem' }}>
						<div className="stat-card">
							<div className="stat-card-icon">
								<FiFileText />
							</div>
							<div className="stat-card-info">
								<h3>{totalAssigned}</h3>
								<p>Total Assigned</p>
							</div>
						</div>

						<div className="stat-card" style={{ borderLeftColor: 'var(--secondary)' }}>
							<div className="stat-card-icon" style={{ background: 'rgba(255, 214, 10, 0.16)', color: 'var(--secondary-dark)' }}>
								<FiClock />
							</div>
							<div className="stat-card-info">
								<h3>{assignedCount}</h3>
								<p>Pending/Assigned</p>
							</div>
						</div>

						<div className="stat-card" style={{ borderLeftColor: '#f97316' }}>
							<div className="stat-card-icon" style={{ background: 'rgba(249, 115, 22, 0.16)', color: '#f97316' }}>
								<FiAlertCircle />
							</div>
							<div className="stat-card-info">
								<h3>{inProgressCount}</h3>
								<p>In Progress</p>
							</div>
						</div>

						<div className="stat-card" style={{ borderLeftColor: 'var(--success)' }}>
							<div className="stat-card-icon" style={{ background: 'rgba(16, 185, 129, 0.16)', color: 'var(--success)' }}>
								<FiCheckCircle />
							</div>
							<div className="stat-card-info">
								<h3>{resolvedCount}</h3>
								<p>Resolved</p>
							</div>
						</div>
					</div>

					<div className="table-container fade-in">
						<div className="table-header">
							<h2 className="section-title">Assigned Complaints</h2>
							<Link to="/agent/complaints" className="btn-primary">
								View All
							</Link>
						</div>

						{isLoading ? (
							<div className="empty-state">
								<div className="empty-state-icon">⏳</div>
								<h3>Loading assigned complaints...</h3>
							</div>
						) : recentComplaints.length === 0 ? (
							<div className="empty-state">
								<div className="empty-state-icon">📭</div>
								<h3>No complaints assigned</h3>
								<p>You do not have any assigned complaints yet.</p>
							</div>
						) : (
							<table className="table">
								<thead>
									<tr>
										<th>Tracking No</th>
										<th>Title</th>
										<th>Category</th>
										<th>Status</th>
										<th>Priority</th>
										<th>Filed By</th>
										<th>Date</th>
									</tr>
								</thead>
								<tbody>
									{recentComplaints.map((complaint) => (
										<tr key={complaint._id}>
											<td>{complaint.trackingNumber || '-'}</td>
											<td>{complaint.title || '-'}</td>
											<td>{complaint.category || '-'}</td>
											<td>
												<span className={getStatusClass(complaint.status)}>{complaint.status || '-'}</span>
											</td>
											<td>
												<span className={getPriorityClass(complaint.priority)}>{complaint.priority || '-'}</span>
											</td>
											<td>{complaint.user?.name || '-'}</td>
											<td>{formatDate(complaint.createdAt)}</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}