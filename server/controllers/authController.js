const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/User');
const Agent = require('../models/Agent');

function generateToken(id) {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
}

async function registerUser(req, res) {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}

		const { name, email, password, phone, address } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: 'User already exists',
			});
		}

		const user = await User.create({
			name,
			email,
			password,
			phone,
			address,
			role: 'USER',
		});

		const token = generateToken(user._id);
		const userData = user.toObject();
		delete userData.password;

		return res.status(201).json({
			success: true,
			token,
			user: userData,
		});
	} catch (error) {
		console.error('AUTH ERROR:', error);

		return res.status(500).json({
			success: false,
			message: error.message || 'Server Error',
			stack: error.stack,
		});
	}
}

async function registerAgent(req, res) {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}

		const { name, email, password, phone, address, department } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: 'User already exists',
			});
		}

		const user = await User.create({
			name,
			email,
			password,
			phone,
			address,
			role: 'AGENT',
			isApproved: false,
		});

		await Agent.create({
			user: user._id,
			department,
			assignedComplaints: [],
			totalResolved: 0,
			isAvailable: true,
		});

		return res.status(201).json({
			success: true,
			message: 'Agent registered successfully. Waiting for admin approval.',
		});
	} catch (error) {
		console.error('AUTH ERROR:', error);

		return res.status(500).json({
			success: false,
			message: error.message || 'Server Error',
			stack: error.stack,
		});
	}
}

async function loginUser(req, res) {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}

		const { email, password } = req.body;

		const user = await User.findOne({ email });
        console.log('USER FOUND:', user?.email);
        console.log('HASH:', user?.password);
        console.log('PASSWORD RECEIVED:', password);
		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Invalid email or password',
			});
		}

		const isPasswordValid = await user.matchPassword(password);
        console.log('PASSWORD MATCH:', isPasswordValid);
		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: 'Invalid email or password',
			});
		}

		if (user.role === 'AGENT' && !user.isApproved) {
			return res.status(403).json({
				success: false,
				message: 'Agent account awaiting approval',
			});
		}

		const token = generateToken(user._id);
		const userData = user.toObject();
		delete userData.password;

		return res.json({
			success: true,
			token,
			user: userData,
		});
	} catch (error) {
		console.error('AUTH ERROR:', error);

		return res.status(500).json({
			success: false,
			message: error.message || 'Server Error',
			stack: error.stack,
		});
	}
}

async function getProfile(req, res) {
	try {
		return res.json({
			success: true,
			user: req.user,
		});
	} catch (error) {
		console.error('AUTH ERROR:', error);

		return res.status(500).json({
			success: false,
			message: error.message || 'Server Error',
		});
	}
}

module.exports = {
	registerUser,
	registerAgent,
	loginUser,
	getProfile,
};
