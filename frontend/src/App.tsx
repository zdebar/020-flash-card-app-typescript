import './App.css';
import Header from './components/Header';
import LoginCard from './components/LoginCard';
import { Routes, Route, Link } from 'react-router-dom';
import { useUser } from './hooks/useUser';
import PracticeCard from './components/PracticeCard';
import UserSettings from './components/UserSettings';
import UserDashboard from './components/UserDashboard';
import Button from './components/Button';

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
                <div>
                  <h1>Ahoj, {userInfo.name}!</h1>
                </div>
              ) : (
                <div className="w-full p-4">
                  <Button isActive={true}>
                    <Link to="/login">Přihlášení / Registrace</Link>
                  </Button>
                </div>
              )
            }
          />
          <Route path="/login" element={<LoginCard />} />
          <Route path="/practice" element={<PracticeCard />} />
          <Route path="/userSettings" element={<UserSettings />} />
          <Route path="/userDashboard" element={<UserDashboard />} />
        </Routes>
      </div>
    </div>
  );
}
