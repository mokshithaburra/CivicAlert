const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			unique: true,
		},
		department: {
			type: String,
			required: true,
			enum: ['Municipal', 'Electricity', 'Police', 'Water', 'Roads', 'Other'],
		},
		assignedComplaints: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'Complaint',
			default: [],
		},
		totalResolved: {
			type: Number,
			default: 0,
		},
		isAvailable: {
			type: Boolean,
			default: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: false,
	}
);

const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;
