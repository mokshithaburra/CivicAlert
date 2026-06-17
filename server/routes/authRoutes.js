const express = require('express');
const { body } = require('express-validator');

const {
	registerUser,
	registerAgent,
	loginUser,
	getProfile,
} = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
	'/register',
	[
		body('name').notEmpty().withMessage('Name is required'),
		body('email').isEmail().withMessage('Please enter a valid email'),
		body('password')
			.isLength({ min: 6 })
			.withMessage('Password must be at least 6 characters'),
		body('phone').notEmpty().withMessage('Phone is required'),
	],
	registerUser
);

router.post(
	'/register-agent',
	[
		body('name').notEmpty().withMessage('Name is required'),
		body('email').isEmail().withMessage('Please enter a valid email'),
		body('password')
			.isLength({ min: 6 })
			.withMessage('Password must be at least 6 characters'),
		body('phone').notEmpty().withMessage('Phone is required'),
		body('department').notEmpty().withMessage('Department is required'),
	],
	registerAgent
);

router.post(
	'/login',
	[
		body('email').isEmail().withMessage('Please enter a valid email'),
		body('password').notEmpty().withMessage('Password is required'),
	],
	loginUser
);

router.get('/profile', protect, getProfile);

module.exports = router;
