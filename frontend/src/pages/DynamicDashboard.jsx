// src/components/DynamicDashboard.jsx
import { useAuth } from '../context/AuthContext.jsx';
import AdminDashboard from '../components/admin/AdminDashboard.jsx';
import ManagerDashboard from '../components/admin/ManagerDashboard.jsx';
import UserDashboard from '../components/admin/UserDashboard.jsx';
import { Navigate } from 'react-router-dom';

const DynamicDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  switch (user.roleName) {
    case 'admin':
      return <AdminDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    default:
      return <UserDashboard />;
  }
};

export default DynamicDashboard;