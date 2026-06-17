import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	FiShield,
	FiUsers,
	FiFileText,
	FiLogOut,
	FiHome,
	FiRefreshCw,
	FiCheck,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManageAgents() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const [pendingAgents, setPendingAgents] = useState([]);
	const [approvedAgents, setApprovedAgents] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [approvingId, setApprovingId] = useState(null);

	useEffect(() => {
		fetchAgents();
	}, []);

	const fetchAgents = async () => {
		try {
			setIsLoading(true);
			const response = await api.get('/admin/agents/pending');
			setPendingAgents(response.data.agents || []);
		} catch (error) {
			console.error(error);
			toast.error(
				error.response?.data?.message || 'Failed to load agents'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleApprove = async (agentId) => {
		try {
			setApprovingId(agentId);
			await api.put(`/admin/agents/${agentId}/approve`);

			const approvedAgent = pendingAgents.find(
				(agent) => agent._id === agentId
			);

			if (approvedAgent) {
				setApprovedAgents((prev) => [
					...prev,
					{ ...approvedAgent, isApproved: true },
				]);
			}

			setPendingAgents((prev) =>
				prev.filter((agent) => agent._id !== agentId)
			);

			toast.success('Agent approved successfully!');
		} catch (error) {
			console.error(error);
			toast.error(
				error.response?.data?.message || 'Failed to approve agent'
			);
		} finally {
			setApprovingId(null);
		}
	};

	const handleLogout = () => {
		logout();
		navigate('/login', { replace: true });
	};

	const formatDate = (date) => {
		if (!date) return '-';
		return new Date(date).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	return (
		<div className="main-content" style={{ marginLeft: 0 }}>
			<aside className="sidebar">
				<div className="sidebar-header">
					<FiShield size={28} color="var(--secondary)" />
					<h2 className="sidebar-logo">CivicAlert</h2>
				</div>

				<nav className="sidebar-nav">
					<Link to="/admin/dashboard" className="sidebar-link">
						<FiHome size={18} />
						Dashboard
					</Link>
					<Link to="/admin/manage-agents" className="sidebar-link active">
						<FiUsers size={18} />
						Manage Agents
					</Link>
					<Link to="/admin/manage-complaints" className="sidebar-link">
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
					<span className="topbar-title">Manage Agents</span>
					<div className="topbar-user">
						<div className="user-avatar">
							{user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
						</div>
						<span>{user?.name || 'Admin'}</span>
					</div>
				</div>

				<div className="page-wrapper fade-in">
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							gap: '1rem',
							flexWrap: 'wrap',
							marginBottom: '1.5rem',
						}}
					>
						<h1 className="page-title">Manage Agents</h1>
						<button
							type="button"
							className="btn-outline"
							onClick={fetchAgents}
							disabled={isLoading}
						>
							<FiRefreshCw size={16} /> Refresh
						</button>
					</div>

					{/* Pending Approvals Table */}
					<div className="table-container fade-in" style={{ marginBottom: '1.5rem' }}>
						<div className="table-header">
							<h2 className="section-title">Pending Approvals</h2>
							<span
								style={{
									background: 'var(--secondary)',
									color: 'var(--dark)',
									borderRadius: '999px',
									padding: '0.25rem 0.75rem',
									fontSize: '0.875rem',
									fontWeight: '700',
								}}
							>
								{pendingAgents.length}
							</span>
						</div>

						{isLoading ? (
							<div className="empty-state">
								<div className="empty-state-icon">⏳</div>
								<h3>Loading agents...</h3>
							</div>
						) : pendingAgents.length === 0 ? (
							<div className="empty-state">
								<div className="empty-state-icon">👥</div>
								<h3>No pending approvals</h3>
								<p>All agent requests have been handled.</p>
							</div>
						) : (
							<div style={{ overflowX: 'auto' }}>
								<table className="table">
									<thead>
										<tr>
											<th>Name</th>
											<th>Email</th>
											<th>Phone</th>
											<th>Registered</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										{pendingAgents.map((agent) => (
											<tr key={agent._id}>
												<td>
													<strong>{agent.name}</strong>
												</td>
												<td>{agent.email}</td>
												<td>{agent.phone}</td>
												<td>{formatDate(agent.createdAt)}</td>
												<td>
													<button
														type="button"
														className="btn-primary"
														style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
														onClick={() => handleApprove(agent._id)}
														disabled={approvingId === agent._id}
													>
														<FiCheck size={14} />
														{approvingId === agent._id
															? 'Approving...'
															: 'Approve'}
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>

					{/* Approved This Session Table */}
					<div className="table-container fade-in">
						<div className="table-header">
							<h2 className="section-title">Approved This Session</h2>
							<span
								style={{
									background: 'var(--success)',
									color: 'var(--white)',
									borderRadius: '999px',
									padding: '0.25rem 0.75rem',
									fontSize: '0.875rem',
									fontWeight: '700',
								}}
							>
								{approvedAgents.length}
							</span>
						</div>

						{approvedAgents.length === 0 ? (
							<div className="empty-state">
								<div className="empty-state-icon">✅</div>
								<h3>No agents approved this session</h3>
								<p>Agents you approve will appear here.</p>
							</div>
						) : (
							<div style={{ overflowX: 'auto' }}>
								<table className="table">
									<thead>
										<tr>
											<th>Name</th>
											<th>Email</th>
											<th>Phone</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										{approvedAgents.map((agent) => (
											<tr key={agent._id}>
												<td>
													<strong>{agent.name}</strong>
												</td>
												<td>{agent.email}</td>
												<td>{agent.phone}</td>
												<td>
													<span className="badge-resolved">
														Approved
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}