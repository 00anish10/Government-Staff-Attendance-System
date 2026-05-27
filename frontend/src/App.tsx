import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StaffList from './pages/StaffList';
import StaffDetail from './pages/StaffDetail';
import AttendanceList from './pages/AttendanceList';
import LeaveList from './pages/LeaveList';
import Departments from './pages/Departments';
import Designations from './pages/Designations';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="staff" element={<StaffList />} />
        <Route path="staff/:id" element={<StaffDetail />} />
        <Route path="attendance" element={<AttendanceList />} />
        <Route path="leaves" element={<LeaveList />} />
        <Route path="departments" element={<Departments />} />
        <Route path="designations" element={<Designations />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
