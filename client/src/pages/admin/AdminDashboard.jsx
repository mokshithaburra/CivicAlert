import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	FiShield,
	FiUsers,
	FiFileText,
	FiLogOut,
	FiHome,
	FiClock,
	FiCheckCircle,
	FiAlertCircle,
	FiUserCheck,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function AdminDashboard() {
	const navigate = useNavigate();
	const { user, logout } = useAuth();

	const [complaints, setComplaints] = useState([]);
	const [pendingAgents, setPendingAgents] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		fetchDashboardData();
	}, []);

	const fetchDashboardData = async () => {
		try {
			setIsLoading(true);

			const [complaintsResponse, agentsResponse] = await Promise.all([
				api.get('/admin/complaints'),
				api.get('/admin/agents/pending'),
			]);

			setComplaints(complaintsResponse?.data?.complaints || []);
			setPendingAgents(agentsResponse?.data?.agents || []);
		} catch (error) {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				'Failed to load dashboard';

			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogout = () => {
		logout();
		navigate('/login', { replace: true });
	};

	const formatDate = (dateValue) => {
		if (!dateValue) return '-';

		return new Date(dateValue).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
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

	const totalComplaints = complaints.length;

	const pendingCount = complaints.filter(
		(item) => item.status === 'Pending'
	).length;

	const inProgressCount = complaints.filter(
		(item) => item.status === 'In Progress'
	).length;

	const resolvedCount = complaints.filter(
		(item) => item.status === 'Resolved'
	).length;

	const pendingApprovalsCount = pendingAgents.length;

	const recentComplaints = complaints.slice(0, 5);

	return (
		<div className="main-content" style={{ marginLeft: 0 }}>
			<aside className="sidebar">
				<div className="sidebar-header">
					<FiShield size={28} color="var(--secondary)" />
					<h2 className="sidebar-logo">CivicAlert</h2>
				</div>

				<nav className="sidebar-nav">
					<Link
						to="/admin/dashboard"
						className="sidebar-link active"
					>
						<FiHome size={18} />
						Dashboard
					</Link>

					<Link
						to="/admin/manage-agents"
						className="sidebar-link"
					>
						<FiUsers size={18} />
						Manage Agents
					</Link>

					<Link
						to="/admin/manage-complaints"
						className="sidebar-link"
					>
						<FiFileText size={18} />
						Manage Complaints
					</Link>
				</nav>

				<div className="sidebar-footer">
					<button
						type="button"
						className="sidebar-link btn-danger"
						onClick={handleLogout}
					>
						<FiLogOut size={18} />
						Logout
					</button>
				</div>
			</aside>

			<div className="main-content" style={{ marginLeft: 260 }}>
				<div className="topbar">
					<span className="topbar-title">
						Admin Dashboard
					</span>

					<div className="topbar-user">
						<div className="user-avatar">
							{user?.name
								? user.name.charAt(0).toUpperCase()
								: 'A'}
						</div>

						<span>{user?.name || 'Admin'}</span>
					</div>
				</div>

				<div className="page-wrapper fade-in">
					<h1 className="page-title">
						Admin Dashboard
					</h1>

					<p>System overview and management</p>

					<div
						className="stats-grid"
						style={{ marginTop: '1.5rem' }}
					>
						<div className="stat-card">
							<div className="stat-card-icon">
								<FiFileText />
							</div>

							<div className="stat-card-info">
								<h3>{totalComplaints}</h3>
								<p>Total Complaints</p>
							</div>
						</div>

						<div
							className="stat-card"
							style={{
								borderLeftColor:
									'var(--secondary)',
							}}
						>
							<div
								className="stat-card-icon"
								style={{
									background:
										'rgba(255,214,10,0.16)',
									color:
										'var(--secondary-dark)',
								}}
							>
								<FiClock />
							</div>

							<div className="stat-card-info">
								<h3>{pendingCount}</h3>
								<p>Pending</p>
							</div>
						</div>

						<div
							className="stat-card"
							style={{
								borderLeftColor: '#f97316',
							}}
						>
							<div
								className="stat-card-icon"
								style={{
									background:
										'rgba(249,115,22,0.16)',
									color: '#f97316',
								}}
							>
								<FiAlertCircle />
							</div>

							<div className="stat-card-info">
								<h3>{inProgressCount}</h3>
								<p>In Progress</p>
							</div>
						</div>

						<div
							className="stat-card"
							style={{
								borderLeftColor:
									'var(--success)',
							}}
						>
							<div
								className="stat-card-icon"
								style={{
									background:
										'rgba(16,185,129,0.16)',
									color:
										'var(--success)',
								}}
							>
								<FiCheckCircle />
							</div>

							<div className="stat-card-info">
								<h3>{resolvedCount}</h3>
								<p>Resolved</p>
							</div>
						</div>

						<div
							className="stat-card"
							style={{
								borderLeftColor: '#3b82f6',
							}}
						>
							<div
								className="stat-card-icon"
								style={{
									background:
										'rgba(59,130,246,0.16)',
									color: '#3b82f6',
								}}
							>
								<FiUserCheck />
							</div>

							<div className="stat-card-info">
								<h3>{pendingApprovalsCount}</h3>
								<p>Pending Approvals</p>
							</div>
						</div>
					</div>

					<div
						style={{
							display: 'grid',
							gridTemplateColumns:
								'repeat(auto-fit,minmax(500px,1fr))',
							gap: '1.5rem',
							marginTop: '1.5rem',
						}}
					>
						<div className="table-container">
							<div className="table-header">
								<h2 className="section-title">
									Recent Complaints
								</h2>

								<Link
									to="/admin/manage-complaints"
									className="btn-primary"
								>
									View All
								</Link>
							</div>

							{isLoading ? (
								<div className="empty-state">
									<h3>
										Loading complaints...
									</h3>
								</div>
							) : recentComplaints.length === 0 ? (
								<div className="empty-state">
									<h3>No complaints found</h3>
								</div>
							) : (
								<table className="table">
									<thead>
										<tr>
											<th>Title</th>
											<th>Category</th>
											<th>Status</th>
											<th>Priority</th>
											<th>Date</th>
										</tr>
									</thead>

									<tbody>
										{recentComplaints.map(
											(complaint) => (
												<tr
													key={
														complaint._id
													}
												>
													<td>
														{
															complaint.title
														}
													</td>

													<td>
														{
															complaint.category
														}
													</td>

													<td>
														<span
															className={getStatusClass(
																complaint.status
															)}
														>
															{
																complaint.status
															}
														</span>
													</td>

													<td>
														<span
															className={getPriorityClass(
																complaint.priority
															)}
														>
															{
																complaint.priority
															}
														</span>
													</td>

													<td>
														{formatDate(
															complaint.createdAt
														)}
													</td>
												</tr>
											)
										)}
									</tbody>
								</table>
							)}
						</div>
 
						<div className="table-container">
							<div className="table-header">
								<h2 className="section-title">
									Pending Approvals
								</h2>

								<Link
									to="/admin/manage-agents"
									className="btn-primary"
								>
									Manage
								</Link>
							</div>

							{pendingAgents.length === 0 ? (
								<div className="empty-state">
									<h3>
										No pending approvals
									</h3>
								</div>
							) : (
								<table className="table">
									<thead>
										<tr>
											<th>Name</th>
											<th>Email</th>
											<th>Registered</th>
										</tr>
									</thead>

									<tbody>
										{pendingAgents.map(
											(agent) => (
												<tr
													key={
														agent._id
													}
												>
													<td>
														{
															agent.name
														}
													</td>

													<td>
														{
															agent.email
														}
													</td>

													<td>
														{formatDate(
															agent.createdAt
														)}
													</td>
												</tr>
											)
										)}
									</tbody>
								</table>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}