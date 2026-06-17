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
	FiRefreshCw,
	FiEdit2,
	FiX,
	FiCheck,
} from 'react-icons/fi';

export default function AgentComplaints() {
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const [complaints, setComplaints] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [activeFilter, setActiveFilter] = useState('All');
	const [selectedComplaint, setSelectedComplaint] = useState(null);
	const [modalType, setModalType] = useState(null);
	const [newStatus, setNewStatus] = useState('In Progress');
	const [noteText, setNoteText] = useState('');
	const [submitting, setSubmitting] = useState(false);

	const fetchComplaints = async () => {
		try {
			setIsLoading(true);
			const response = await api.get('/agent/complaints');
			const complaintList = response?.data?.data || response?.data?.complaints || [];
			setComplaints(Array.isArray(complaintList) ? complaintList : []);
		} catch (error) {
			const message =
				error?.response?.data?.message || error?.message || 'Failed to load assigned complaints';
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

	const closeModal = () => {
		setSelectedComplaint(null);
		setModalType(null);
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

	const handleUpdateStatus = async () => {
		if (!selectedComplaint) return;

		try {
			setSubmitting(true);
			await api.put(`/agent/complaints/${selectedComplaint._id}/status`, {
				status: newStatus,
			});
			toast.success('Status updated!');
			await fetchComplaints();
			closeModal();
		} catch (error) {
			const message =
				error?.response?.data?.message || error?.message || 'Failed to update status';
			toast.error(message);
		} finally {
			setSubmitting(false);
		}
	};

	const handleAddNote = async () => {
		if (!selectedComplaint) return;

		try {
			setSubmitting(true);
			await api.put(`/agent/complaints/${selectedComplaint._id}/note`, {
				note: noteText,
			});
			toast.success('Note added!');
			await fetchComplaints();
			closeModal();
			setNoteText('');
		} catch (error) {
			const message =
				error?.response?.data?.message || error?.message || 'Failed to add note';
			toast.error(message);
		} finally {
			setSubmitting(false);
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
					<Link to="/agent/dashboard" className="sidebar-link">
						<FiHome size={18} />
						Dashboard
					</Link>
					<Link to="/agent/complaints" className="sidebar-link active">
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
					<span className="topbar-title">Assigned Complaints</span>
					<div className="topbar-user">
						<div className="user-avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'A'}</div>
						<span>{user?.name || 'Agent'}</span>
					</div>
				</div>

				<div className="page-wrapper fade-in">
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
						<h1 className="page-title">Assigned Complaints</h1>
						<button type="button" className="btn-outline" onClick={fetchComplaints} disabled={isLoading}>
							<FiRefreshCw size={16} /> Refresh
						</button>
					</div>

					<div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', margin: '1.25rem 0 1.5rem' }}>
						{['All', 'Assigned', 'In Progress', 'Resolved'].map((filter) => (
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
						<div className="empty-state">
							<div className="empty-state-icon">⏳</div>
							<h3>Loading complaints...</h3>
						</div>
					) : filteredComplaints.length === 0 ? (
						<div className="empty-state">
							<div className="empty-state-icon">📭</div>
							<h3>No complaints found</h3>
							<p>No complaints match the selected filter.</p>
						</div>
					) : (
						<div style={{ display: 'grid', gap: '1rem' }}>
							{filteredComplaints.map((complaint) => (
								<div key={complaint._id} className="complaint-card fade-in">
									<div className="complaint-card-header">
										<div className="complaint-card-title">{complaint.title || '-'}</div>
										<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
											<span className={getStatusClass(complaint.status)}>{complaint.status || '-'}</span>
											<span className={getPriorityClass(complaint.priority)}>{complaint.priority || '-'}</span>
										</div>
									</div>

									<p style={{ color: 'var(--gray)', marginBottom: '1rem' }}>
										{(complaint.description || '-').length > 120
											? `${complaint.description.slice(0, 120)}...`
											: complaint.description || '-'}
									</p>

									<div className="complaint-card-meta">
										<span>🎫 {complaint.trackingNumber || '-'}</span>
										<span>📁 {complaint.category || '-'}</span>
										<span>📍 {complaint.location || '-'}</span>
										<span>📅 {formatDate(complaint.createdAt)}</span>
										<span>👤 {complaint.user?.name || '-'}</span>
									</div>

									{Array.isArray(complaint.actionNotes) && complaint.actionNotes.length > 0 && (
										<div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
											<strong>Latest Update:</strong>{' '}
											<span style={{ color: 'var(--gray)', fontStyle: 'italic' }}>
												{complaint.actionNotes[complaint.actionNotes.length - 1]}
											</span>
										</div>
									)}

									<div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
										<button
											type="button"
											className="btn-secondary"
											onClick={() => {
												setSelectedComplaint(complaint);
												setNewStatus(complaint.status || 'In Progress');
												setModalType('status');
											}}
										>
											<FiEdit2 size={16} /> Update Status
										</button>
										<button
											type="button"
											className="btn-outline"
											onClick={() => {
												setSelectedComplaint(complaint);
												setNoteText('');
												setModalType('note');
											}}
										>
											<FiEdit2 size={16} /> Add Note
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{selectedComplaint && modalType === 'status' && (
				<div className="modal-overlay" onClick={closeModal}>
					<div className="modal" onClick={(event) => event.stopPropagation()}>
						<div className="modal-header">
							<h3 className="section-title">Update Status</h3>
							<button type="button" className="btn-outline" onClick={closeModal}>
								<FiX size={16} />
							</button>
						</div>

						<div style={{ marginBottom: '1rem' }}>
							<span className={getStatusClass(selectedComplaint.status)}>
								Current: {selectedComplaint.status || '-'}
							</span>
						</div>

						<div className="form-group">
							<label htmlFor="status">New Status</label>
							<select
								id="status"
								className="input-field"
								value={newStatus}
								onChange={(event) => setNewStatus(event.target.value)}
							>
								<option value="Assigned">Assigned</option>
								<option value="In Progress">In Progress</option>
								<option value="Resolved">Resolved</option>
								<option value="Closed">Closed</option>
							</select>
						</div>

						<div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
							<button type="button" className="btn-outline" onClick={closeModal}>
								Cancel
							</button>
							<button type="button" className="btn-primary" onClick={handleUpdateStatus} disabled={submitting}>
								<FiCheck size={16} /> {submitting ? 'Updating...' : 'Update Status'}
							</button>
						</div>
					</div>
				</div>
			)}

			{selectedComplaint && modalType === 'note' && (
				<div className="modal-overlay" onClick={closeModal}>
					<div className="modal" onClick={(event) => event.stopPropagation()}>
						<div className="modal-header">
							<h3 className="section-title">Add Action Note</h3>
							<button type="button" className="btn-outline" onClick={closeModal}>
								<FiX size={16} />
							</button>
						</div>

						<div className="form-group">
							<label htmlFor="note">Note</label>
							<textarea
								id="note"
								className="input-field"
								rows="4"
								placeholder="Describe the action taken..."
								value={noteText}
								onChange={(event) => setNoteText(event.target.value)}
							/>
						</div>

						<div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
							<button type="button" className="btn-outline" onClick={closeModal}>
								Cancel
							</button>
							<button type="button" className="btn-primary" onClick={handleAddNote} disabled={submitting}>
								<FiCheck size={16} /> {submitting ? 'Adding...' : 'Add Note'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}