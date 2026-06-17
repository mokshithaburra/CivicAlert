const express = require('express');
const { body } = require('express-validator');

const protect = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const {
	getPendingAgents,
	getAllAgents,
	approveAgent,
	getAllComplaints,
	assignComplaint,
} = require('../controllers/adminController');

const router = express.Router();

router.get('/agents', protect, authorizeRoles('ADMIN'), getAllAgents);

router.get('/agents/pending', protect, authorizeRoles('ADMIN'), getPendingAgents);

router.put('/agents/:id/approve', protect, authorizeRoles('ADMIN'), approveAgent);

router.get('/complaints', protect, authorizeRoles('ADMIN'), getAllComplaints);

router.put(
	'/complaints/:id/assign',
	protect,
	authorizeRoles('ADMIN'),
	[body('agentId').notEmpty().withMessage('agentId is required')],
	assignComplaint
);

module.exports = router;
