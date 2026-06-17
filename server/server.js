require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const connectToDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const adminRoutes = require('./routes/adminRoutes');
const agentRoutes = require('./routes/agentRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/agent', agentRoutes);

app.get('/', (req, res) => {
	res.json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
	await connectToDB();
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}

startServer();
