const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
	{
		complaint: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Complaint',
			required: true,
			unique: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		agent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
		comment: {
			type: String,
			trim: true,
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

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
