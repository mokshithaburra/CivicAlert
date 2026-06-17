const { validationResult } = require('express-validator');

const Agent = require('../models/Agent');
const Complaint = require('../models/Complaint');

async function getAssignedComplaints(req, res) {
	try {
		const agent = await Agent.findOne({ user: req.user._id });

		if (!agent) {
			return res.status(404).json({
				success: false,
				message: 'Agent profile not found',
				data: null,
			});
		}

		const complaints = await Complaint.find({ _id: { $in: agent.assignedComplaints } })
			.sort({ createdAt: -1 })
			.populate('user', 'name email');

		return res.json({
			success: true,
			message: 'Assigned complaints retrieved successfully',
			data: complaints,
		});
	} catch (error) {
		console.error('AGENT ERROR:', error);

		return res.status(500).json({
			success: false,
			message: error.message || 'Server Error',
			data: null,
		});
	}
}

async function getAssignedComplaintById(req, res) {
	try {
		const complaint = await Complaint.findById(req.params.id)
			.populate('user', 'name email')
			.populate('assignedAgent', 'name email');

		if (!complaint) {
			return res.status(404).json({
				success: false,
				message: 'Complaint not found',
				data: null,
			});
		}

		const isAssignedToAgent = complaint.assignedAgent && complaint.assignedAgent._id.toString() === req.user._id.toString();

		if (!isAssignedToAgent) {
			return res.status(403).json({
				success: false,
				message: 'Access denied',
				data: null,
			});
		}

		return res.json({
			success: true,
			message: 'Complaint details retrieved successfully',
			data: complaint,
		});
	} catch (error) {
		console.error('AGENT ERROR:', error);

		return res.status(500).json({
			success: false,
			message: error.message || 'Server Error',
			data: null,
		});
	}
}

async function updateComplaintStatus(req, res) {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				errors: errors.array(),
			});
		}

		const complaint = await Complaint.findById(req.params.id);

		if (!complaint) {
			return res.status(404).json({
				success: false,
				message: 'Complaint not found',
				data: null,
			});
		}

		if (!complaint.assignedAgent || complaint.assignedAgent.toString() !== req.user._id.toString()) {
			return res.status(403).json({
				success: false,
				message: 'Access denied',
				data: null,
			});
		}

		const allowedStatuses = ['Assigned', 'In Progress', 'Resolved', 'Closed'];
		const { status } = req.body;

		if (!allowedStatuses.includes(status)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid status value',
				data: null,
			});
		}

		complaint.status = status;
		complaint.updatedAt = Date.now();
		await complaint.save();

		return res.json({
			success: true,
			message: 'Complaint status updated successfully',
			data: complaint,
		});
	} catch (error) {
		console.error('AGENT ERROR:', error);

		return res.status(500).json({
			success: false,
			message: error.message || 'Server Error',
			data: null,
		});
	}
}

async function addActionNote(req, res) {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				errors: errors.array(),
			});
		}

		const complaint = await Complaint.findById(req.params.id);

		if (!complaint) {
			return res.status(404).json({
				success: false,
				message: 'Complaint not found',
				data: null,
			});
		}

		if (!complaint.assignedAgent || complaint.assignedAgent.toString() !== req.user._id.toString()) {
			return res.status(403).json({
				success: false,
				message: 'Access denied',
				data: null,
			});
		}

		const { note } = req.body;
		if (!note) {
			return res.status(400).json({
				success: false,
				message: 'Action note is required',
				data: null,
			});
		}

		complaint.actionNotes.push(note);
		complaint.updatedAt = Date.now();
		await complaint.save();

		return res.json({
			success: true,
			message: 'Action note added successfully',
			data: complaint,
		});
	} catch (error) {
		console.error('AGENT ERROR:', error);

		return res.status(500).json({
			success: false,
			message: error.message || 'Server Error',
			data: null,
		});
	}
}

module.exports = {
	getAssignedComplaints,
	getAssignedComplaintById,
	updateComplaintStatus,
	addActionNote,
};
