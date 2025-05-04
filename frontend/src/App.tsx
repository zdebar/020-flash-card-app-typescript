import './App.css';
import Header from './components/Header';
import LoginCard from './components/LoginCard';
import { Routes, Route, Link } from 'react-router-dom';
import { useUser } from './hooks/useUser';
import UserSettingsCard from './components/UserSettingsCard';
import UserDashboardCard from './components/UserDashboardCard';
import Button from './components/common/Button';
import PronunciationListCard from './components/PronunciationListCard';
import PronunciationCard from './components/Pronunciation';
import GrammarCard from './components/GrammarCard';
import VocabularyCard from './components/VocabularyCard';

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
                <div className="w-[320px] p-4">
                  <Button className="rounded-md">
                    <Link to="/login">Přihlášení / Registrace</Link>
                  </Button>
                </div>
              )
            }
          />
          <Route path="/login" element={<LoginCard />} />
          <Route
            path="/pronunciationList"
            element={<PronunciationListCard />}
          />
          <Route path="/pronunciation/:id" element={<PronunciationCard />} />
          <Route path="/vocabulary" element={<VocabularyCard />} />
          <Route path="/grammar" element={<GrammarCard />} />
          <Route path="/userSettings" element={<UserSettingsCard />} />
          <Route path="/userDashboard" element={<UserDashboardCard />} />
        </Routes>
      </div>
    </div>
  );
}
