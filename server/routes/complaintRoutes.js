const express = require('express');
const { body } = require('express-validator');

const {
	createComplaint,
	getMyComplaints,
	getComplaintById,
} = require('../controllers/complaintController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
	'/',
	protect,
	[
		body('title').notEmpty().withMessage('Title is required'),
		body('description').notEmpty().withMessage('Description is required'),
		body('category').notEmpty().withMessage('Category is required'),
		body('location').notEmpty().withMessage('Location is required'),
	],
	createComplaint
);

router.get('/my-complaints', protect, getMyComplaints);

router.get('/:id', protect, getComplaintById);

module.exports = router;