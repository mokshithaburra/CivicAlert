import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserDashboard from './pages/user/UserDashboard';
import FileComplaint from './pages/user/FileComplaint';
import MyComplaints from './pages/user/MyComplaints';
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentComplaints from './pages/agent/AgentComplaints';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageAgents from './pages/admin/ManageAgents';
import ManageComplaints from './pages/admin/ManageComplaints';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/user/dashboard"
            element={<PrivateRoute element={<UserDashboard />} roles={['USER']} />}
          />
          <Route
            path="/user/file-complaint"
            element={<PrivateRoute element={<FileComplaint />} roles={['USER']} />}
          />
          <Route
            path="/user/my-complaints"
            element={<PrivateRoute element={<MyComplaints />} roles={['USER']} />}
          />
          <Route
            path="/agent/dashboard"
            element={<PrivateRoute element={<AgentDashboard />} roles={['AGENT']} />}
          />
          <Route
            path="/agent/complaints"
            element={<PrivateRoute element={<AgentComplaints />} roles={['AGENT']} />}
          />
          <Route
            path="/admin/dashboard"
            element={<PrivateRoute element={<AdminDashboard />} roles={['ADMIN']} />}
          />
          <Route
            path="/admin/manage-agents"
            element={<PrivateRoute element={<ManageAgents />} roles={['ADMIN']} />}
          />
          <Route
            path="/admin/manage-complaints"
            element={<PrivateRoute element={<ManageComplaints />} roles={['ADMIN']} />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
