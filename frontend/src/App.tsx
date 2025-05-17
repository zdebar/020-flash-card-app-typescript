import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useUser } from './hooks/useUser';
import ButtonLink from './components/common/ButtonLink';
import Header from './components/Header';
import Login from './components/Login';
import PracticeCard from './components/PracticeCard';
import UserSettings from './components/UserSettings';
import UserDashboard from './components/UserDashboard';
import GrammarList from './components/GrammarlList';

export default function App() {
  const { userInfo, loading } = useUser();

  return (
    <div className="h-screen dark:bg-gray-900">
      <div className="w-app min-w-card mx-auto flex h-full w-full flex-col items-center">
        <Header />

        <div
          className={`app z-1 flex h-full w-full flex-col items-center gap-1`}
        >
          <Routes>
            <Route
              path="/"
              element={
                loading ? (
                  <p>Loading...</p>
                ) : userInfo ? (
                  <div>
                    <h1>Uživatel: {userInfo.name}</h1>
                  </div>
                ) : (
                  <div className="w-card">
                    <ButtonLink to="/login" className="button-rectangular">
                      Přihlášení / Registrace
                    </ButtonLink>
                  </div>
                )
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/practice" element={<PracticeCard />} />
            <Route path="/userSettings" element={<UserSettings />} />
            <Route path="/userDashboard" element={<UserDashboard />} />
            <Route path="/grammarList" element={<GrammarList />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
