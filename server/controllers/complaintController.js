const { validationResult } = require('express-validator');

const Complaint = require('../models/Complaint');

async function createComplaint(req, res) {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				message: 'Validation failed',
				data: errors.array(),
			});
		}

		const {
			title,
			description,
			category,
			location,
			priority,
		} = req.body;

		const complaint = await Complaint.create({
			title,
			description,
			category,
			location,
			priority,
			user: req.user._id,
		});

		return res.status(201).json({
			success: true,
			complaint,
			data: complaint,
		});
	} catch (error) {
		console.error('COMPLAINT ERROR:', error);
		console.error(error.stack);

		return res.status(500).json({
			success: false,
			message: error.message || 'Server Error',
			data: null,
		});
	}
}

async function getMyComplaints(req, res) {
	try {
		const complaints = await Complaint.find({ user: req.user._id }).sort({
			createdAt: -1,
		});

		return res.json({
			success: true,
			count: complaints.length,
			complaints,
			data: {
				count: complaints.length,
				complaints,
			},
		});
	} catch (error) {
		console.error('COMPLAINT ERROR:', error);

		return res.status(500).json({
			success: false,
			message: error.message || 'Server Error',
			data: null,
		});
	}
}

async function getComplaintById(req, res) {
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

		const isOwner = complaint.user && complaint.user._id.toString() === req.user._id.toString();
		const isAdmin = req.user.role === 'ADMIN';

		if (!isOwner && !isAdmin) {
			return res.status(403).json({
				success: false,
				message: 'Access denied',
				data: null,
			});
		}

		return res.json({
			success: true,
			complaint,
			data: complaint,
		});
	} catch (error) {
		console.error('COMPLAINT ERROR:', error);

		return res.status(500).json({
			success: false,
			message: error.message || 'Server Error',
			data: null,
		});
	}
}

module.exports = {
	createComplaint,
	getMyComplaints,
	getComplaintById,
};
