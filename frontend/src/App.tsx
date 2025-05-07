import './App.css';
import Header from './components/Header';
import Login from './components/Login';
import { Routes, Route } from 'react-router-dom';
import { useUser } from './hooks/useUser';
import UserSettings from './components/UserSettings';
import UserDashboard from './components/UserDashboard';
import PracticeCard from './components/PracticeCard';
import ButtonLinkRectangular from './components/common/ButtonLinkRectangular';
import GrammarCard from './components/GrammarCard';
import ItemListCard from './components/ItemListCard';

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
                  <ButtonLinkRectangular to="/login">
                    Přihlášení / Registrace
                  </ButtonLinkRectangular>
                </div>
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/practice" element={<PracticeCard />} />
          <Route path="/userSettings" element={<UserSettings />} />
          <Route path="/userDashboard" element={<UserDashboard />} />
          <Route path="/overview/grammar" element={<GrammarCard />} />
          <Route path="/overview/words" element={<ItemListCard />} />
          <Route path="/overview/sentences" element={<div>Seznam vět</div>} />
        </Routes>
      </div>
    </div>
  );
}
