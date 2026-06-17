import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	FiShield,
	FiUsers,
	FiFileText,
	FiLogOut,
	FiHome,
	FiRefreshCw,
	FiUserPlus,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManageComplaints() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const [complaints, setComplaints] = useState([]);
	const [agents, setAgents] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [assigningId, setAssigningId] = useState(null);
	const [selectedAgents, setSelectedAgents] = useState({});

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			setIsLoading(true);

			const [complaintsRes, agentsRes] = await Promise.all([
				api.get('/admin/complaints'),
				api.get('/admin/agents'),
			]);

			setComplaints(complaintsRes.data.complaints || []);
			setAgents(agentsRes.data.agents || []);
		} catch (error) {
			console.error(error);

			toast.error(
				error.response?.data?.message ||
					'Failed to load complaints'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleAssign = async (complaintId) => {
		const agentId = selectedAgents[complaintId];

		if (!agentId) {
			toast.error('Please select an agent');
			return;
		}

		try {
			setAssigningId(complaintId);

			await api.put(
				`/admin/complaints/${complaintId}/assign`,
				{
					agentId,
				}
			);

			toast.success('Complaint assigned successfully');

			await fetchData();
		} catch (error) {
			console.error(error);

			toast.error(
				error.response?.data?.message ||
					'Assignment failed'
			);
		} finally {
			setAssigningId(null);
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

	const getStatusClass = (status = '') => {
		switch (status.toLowerCase()) {
			case 'pending':
				return 'badge-pending';
			case 'assigned':
				return 'badge-assigned';
			case 'in progress':
				return 'badge-inprogress';
			case 'resolved':
				return 'badge-resolved';
			case 'closed':
				return 'badge-closed';
			default:
				return 'badge-pending';
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
						className="sidebar-link"
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
						className="sidebar-link active"
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
						Manage Complaints
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
					<div className="table-header">
						<h1 className="page-title">
							Manage Complaints
						</h1>

						<button
							className="btn-primary"
							onClick={fetchData}
						>
							<FiRefreshCw />
							Refresh
						</button>
					</div>

					<div className="table-container fade-in">
						<div className="table-header">
							<h2 className="section-title">
								All Complaints
							</h2>

							<span>
								{complaints.length} Complaint(s)
							</span>
						</div>

						{isLoading ? (
							<div className="empty-state">
								<div className="empty-state-icon">
									⏳
								</div>
								<h3>Loading complaints...</h3>
							</div>
						) : complaints.length === 0 ? (
							<div className="empty-state">
								<div className="empty-state-icon">
									📭
								</div>
								<h3>No complaints found</h3>
								<p>
									No complaints have been
									submitted yet.
								</p>
							</div>
						) : (
							<div style={{ overflowX: 'auto' }}>
								<table
									className="table"
									style={{
										minWidth: '1300px',
									}}
								>
									<thead>
										<tr>
											<th>Title</th>
											<th>Category</th>
											<th>Status</th>
											<th>Priority</th>
											<th>User</th>
											<th>Assigned Agent</th>
											<th>Date</th>
											<th>Action</th>
										</tr>
									</thead>

									<tbody>
										{complaints.map(
											(complaint) => (
												<tr
													key={
														complaint._id
													}
												>
													<td>
														<strong>
															{
																complaint.title
															}
														</strong>
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
														{complaint
															.user
															?.name ||
															'-'}
													</td>

													<td>
														{complaint
															.assignedAgent
															?.name ||
															'Unassigned'}
													</td>

													<td>
														{formatDate(
															complaint.createdAt
														)}
													</td>

													<td>
														{complaint.assignedAgent ? (
															<span
																className="badge-assigned"
															>
																Assigned
															</span>
														) : (
															<div
																style={{
																	display:
																		'flex',
																	flexDirection:
																		'column',
																	gap:
																		'0.5rem',
																	minWidth:
																		'180px',
																}}
															>
																<select
																	value={
																		selectedAgents[
																			complaint._id
																		] ||
																		''
																	}
																	onChange={(
																		e
																	) =>
																		setSelectedAgents(
																			(
																				prev
																			) => ({
																				...prev,
																				[
																					complaint._id
																				]:
																					e.target.value,
																			})
																		)
																	}
																>
																	<option value="">
																		Select Agent
																	</option>

																	{agents.map(
																		(
																			agent
																		) => (
																			<option
																				key={
																					agent._id
																				}
																				value={
																					agent._id
																				}
																			>
																				{
																					agent.name
																				}
																			</option>
																		)
																	)}
																</select>

																<button
																	className="btn-primary"
																	onClick={() =>
																		handleAssign(
																			complaint._id
																		)
																	}
																	disabled={
																		assigningId ===
																		complaint._id
																	}
																>
																	<FiUserPlus />
																	&nbsp;
																	{assigningId ===
																	complaint._id
																		? 'Assigning...'
																		: 'Assign'}
																</button>
															</div>
														)}
													</td>
												</tr>
											)
										)}
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