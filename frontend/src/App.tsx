import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useUser } from './hooks/useUser';
import ButtonLinkRectangular from './components/common/ButtonLinkRectangular';
import Header from './components/Header';
import Login from './components/Login';
import PracticeCard from './components/PracticeCard';
import UserSettings from './components/UserSettings';
import UserDashboard from './components/UserDashboard';
import Notes from './components/common/Notes';
import { useState } from 'react';

export default function App() {
  const { userInfo, loading } = useUser();
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const openNotes = () => setIsNotesOpen(true);
  const closeNotes = () => setIsNotesOpen(false);

  return (
    <div className="h-screen dark:bg-gray-900">
      <div className="mx-auto flex h-full w-full max-w-[900px] min-w-[320px] flex-col items-center">
        <Header openNotes={openNotes} />

        <div className="z-1 flex h-full w-full max-w-[600px] flex-col items-center gap-1">
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
          </Routes>
        </div>
        {isNotesOpen && <Notes onClose={closeNotes} />}
      </div>
    </div>
  );
}
