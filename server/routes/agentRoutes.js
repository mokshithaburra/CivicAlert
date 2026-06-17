const express = require('express');
const { body } = require('express-validator');

const protect = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const {
	getAssignedComplaints,
	getAssignedComplaintById,
	updateComplaintStatus,
	addActionNote,
} = require('../controllers/agentController');

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('AGENT'));

router.get('/complaints', getAssignedComplaints);

router.get('/complaints/:id', getAssignedComplaintById);

router.put(
	'/complaints/:id/status',
	[body('status').notEmpty().withMessage('status is required')],
	updateComplaintStatus
);

router.put(
	'/complaints/:id/note',
	[body('note').notEmpty().withMessage('note is required')],
	addActionNote
);

module.exports = router;
