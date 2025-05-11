import './App.css';
import Header from './components/Header';
import Login from './components/Login';
import { Routes, Route } from 'react-router-dom';
import { useUser } from './hooks/useUser';
import UserSettings from './components/UserSettings';
import UserDashboard from './components/UserDashboard';
import PracticeCard from './components/PracticeCard';
import ButtonLinkRectangular from './components/common/ButtonLinkRectangular';
import { Words } from './components/Words';
import { Grammars } from './components/Grammar';

export default function App() {
  const { userInfo, loading } = useUser();

  return (
    <div className="h-screen dark:bg-gray-900">
      <div className="mx-auto flex h-full w-full max-w-[900px] min-w-[320px] flex-col items-center">
        <Header />
        <div className="flex h-full w-full flex-col items-center gap-1 p-4">
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
                  <div className="w-[320px]">
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
            <Route path="/grammars" element={<Grammars />} />
            <Route path="/words" element={<Words />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
