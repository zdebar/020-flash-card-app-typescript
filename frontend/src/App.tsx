import './App.css';
import Header from './components/Header';
import LoginCard from './components/LoginCard';
import RegisterCard from './components/RegisterCard';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './hooks/useUser';
import PracticeCard from './components/PracticeCard';
import UserSettings from './components/UserSettings';
import UserDashboard from './components/UserDashboard';

export default function App() {
  const { userInfo, loading } = useUser();

  return (
    <div className="dark:bg-gray-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[900px] min-w-[320px] flex-col items-center">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              loading ? (
                <p>Loading...</p>
              ) : userInfo ? (
                <h1>Hello {userInfo.username}</h1>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/login" element={<LoginCard />} />
          <Route path="/register" element={<RegisterCard />} />
          <Route path="/practice" element={<PracticeCard />} />
          <Route path="/userSettings" element={<UserSettings />} />
          <Route path="/userDashboard" element={<UserDashboard />} />
        </Routes>
      </div>
    </div>
  );
}
