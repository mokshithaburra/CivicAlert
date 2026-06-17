const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		category: {
			type: String,
			required: true,
			enum: ['Municipal', 'Electricity', 'Police', 'Water', 'Roads', 'Other'],
		},
		location: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			enum: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
			default: 'Pending',
		},
		priority: {
			type: String,
			enum: ['Low', 'Medium', 'High'],
			default: 'Medium',
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		assignedAgent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			default: null,
		},
		attachments: {
			type: [String],
			default: [],
		},
		actionNotes: {
			type: [String],
			default: [],
		},
		trackingNumber: {
			type: String,
			unique: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: false,
	}
);

complaintSchema.pre('save', function () {
	if (!this.trackingNumber) {
		this.trackingNumber = `CMP-${Date.now()}`;
	}

	this.updatedAt = Date.now();
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
