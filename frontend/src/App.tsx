import './App.css';

import { Routes, Route, useLocation } from 'react-router-dom';
import { useUser } from './hooks/useUser';
import ButtonLink from './components/common/ButtonLink';
import Header from './components/Header';
import Login from './components/Login';
import PracticeCard from './components/PracticeCard';
import UserSettings from './components/UserSettings';
import UserDashboard from './components/UserDashboard';
import GrammarList from './components/GrammarlList';
import Footer from './components/Footer';

export default function App() {
  const { userInfo } = useUser();
  const location = useLocation();
  const showFooterRoutes = ['/', '/login'];

  return (
    <div className="color-background min-h-screen">
      <div className="max-w-app min-card mx-auto flex h-full w-full flex-col items-center">
        <Header />

        <div className={`app z-1 flex h-full w-full flex-col items-center`}>
          <Routes>
            <Route
              path="/"
              element={
                <div className="flex w-full max-w-[480px] flex-col items-center justify-start gap-4 p-4 text-center text-xl">
                  <h1 className="font-display">Angličtina jednoduše</h1>
                  <p className="color-notice font-Mansalva">
                    aplikace v testovacím režimu
                  </p>
                  <p>
                    Trénujte až 1000 slovíček či 500 vět za hodinu, a dosáhněte
                    přirozenosti jazyka za zlomek běžného učebního času.
                  </p>

                  {!userInfo && (
                    <div className="max-w-card items">
                      <ButtonLink to="/login" className="button-rectangular">
                        Přihlášení / Registrace
                      </ButtonLink>
                    </div>
                  )}
                </div>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/practice" element={<PracticeCard />} />
            <Route path="/userSettings" element={<UserSettings />} />
            <Route path="/userDashboard" element={<UserDashboard />} />
            <Route path="/grammarList" element={<GrammarList />} />
          </Routes>
        </div>
        {showFooterRoutes.includes(location.pathname) && <Footer />}
      </div>
    </div>
  );
}
