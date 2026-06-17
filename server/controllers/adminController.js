const { validationResult } = require('express-validator');

const User = require('../models/User');
const Agent = require('../models/Agent');
const Complaint = require('../models/Complaint');

async function getPendingAgents(req, res) {
	try {
		const agents = await User.find({ role: 'AGENT', isApproved: false }).select('-password');

		return res.json({
			success: true,
			count: agents.length,
			agents,
		});
	} catch (error) {
		console.error('ADMIN ERROR:', error);
		return res.status(500).json({
			success: false,
			message: error.message || 'Server Error',
		});
	}
}

async function getAllAgents(req, res) {
	try {
		const agents = await User.find({
			role: 'AGENT',
			isApproved: true,
		}).select('-password');

		return res.json({
			success: true,
			count: agents.length,
			agents,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || 'Server Error',
		});
	}
}

async function approveAgent(req, res) {
	try {
		const agent = await User.findById(req.params.id);

		if (!agent || agent.role !== 'AGENT') {
			return res.status(404).json({
				success: false,
				message: 'Agent not found',
			});
		}

		agent.isApproved = true;
		await agent.save();

		return res.json({
			success: true,
			message: 'Agent approved successfully',
		});
	} catch (error) {
		console.error('ADMIN ERROR:', error);
		return res.status(500).json({
			success: false,
			message: error.message || 'Server Error',
		});
	}
}

async function getAllComplaints(req, res) {
	try {
		const complaints = await Complaint.find()
			.sort({ createdAt: -1 })
			.populate('user', 'name email')
			.populate('assignedAgent', 'name email');

		return res.json({
			success: true,
			count: complaints.length,
			complaints,
		});
	} catch (error) {
		console.error('ADMIN ERROR:', error);
		return res.status(500).json({
			success: false,
			message: error.message || 'Server Error',
		});
	}
}

async function assignComplaint(req, res) {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				errors: errors.array(),
			});
		}

		const { id } = req.params;
		const { agentId } = req.body;

		const complaint = await Complaint.findById(id);
		if (!complaint) {
			return res.status(404).json({
				success: false,
				message: 'Complaint not found',
			});
		}

		const agentUser = await User.findById(agentId);
		if (!agentUser || agentUser.role !== 'AGENT') {
			return res.status(404).json({
				success: false,
				message: 'Agent not found',
			});
		}

		if (!agentUser.isApproved) {
			return res.status(400).json({
				success: false,
				message: 'Agent is not approved',
			});
		}

		complaint.assignedAgent = agentId;
		complaint.status = 'Assigned';
		await complaint.save();

		const agentRecord = await Agent.findOne({ user: agentId });
		if (!agentRecord) {
			return res.status(404).json({
				success: false,
				message: 'Agent profile not found',
			});
		}

		if (!agentRecord.assignedComplaints.some((complaintId) => complaintId.toString() === complaint._id.toString())) {
			agentRecord.assignedComplaints.push(complaint._id);
			await agentRecord.save();
		}

		return res.json({
			success: true,
			message: 'Complaint assigned successfully',
			complaint,
		});
	} catch (error) {
		console.error('ADMIN ERROR:', error);
		return res.status(500).json({
			success: false,
			message: error.message || 'Server Error',
		});
	}
}

module.exports = {
	getPendingAgents,
	getAllAgents,
	approveAgent,
	getAllComplaints,
	assignComplaint,
};