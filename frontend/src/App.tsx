import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useUser } from './hooks/useUser';
import ButtonLink from './components/common/ButtonLink';
import Header from './components/common/Header.js';
import Login from './components/Login';
import PracticeCard from './components/PracticeCard';
import UserSettings from './components/UserSettings';
import UserDashboard from './components/UserDashboard';
import GrammarList from './components/GrammarlList';
import Footer from './components/common/Footer.js';
import UserLanguages from './components/UserLanguages';
import UserOverview from './components/UserOverview';
import WordList from './components/WordList';

export default function App() {
  const { userInfo } = useUser();
  const location = useLocation();
  const showFooterRoutes = ['/', '/login'];

  return (
    <div className="color-background">
      <div className="mx-auto flex h-screen max-w-[900px] flex-col justify-between">
        <Header />
        <div className="relative flex h-full flex-grow flex-col items-center overflow-y-auto">
          <Routes>
            <Route
              path="/"
              element={
                <div className="flex w-full max-w-[450px] flex-col items-center justify-start gap-4 px-4 pt-6 text-center">
                  <h1>Minidril</h1>

                  <p>
                    Trénujte 400 slovíček či 200 vět za 20 minut denně, a
                    dosáhněte základní znalosti jazyka za zlomek běžného
                    učebního času.
                  </p>
                  {!userInfo && (
                    <div className="w-card">
                      <ButtonLink to="/login">
                        Přihlášení / Registrace
                      </ButtonLink>
                    </div>
                  )}
                  <p className="notice">aplikace v testovacím režimu</p>
                  <p className="">
                    Rychlý dril. Učební kartičky. Poslouchání a mluvení, žádné
                    psaní. Sekvence slovíček a gramatiky. Procvičování
                    samostatně i ve větách.
                  </p>
                </div>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/practice" element={<PracticeCard />} />
            <Route path="/userSettings" element={<UserSettings />} />
            <Route path="/userDashboard" element={<UserDashboard />} />
            <Route path="/userLanguages" element={<UserLanguages />} />
            <Route path="/userOverview" element={<UserOverview />} />
            <Route path="/grammarList" element={<GrammarList />} />
            <Route path="/wordList" element={<WordList />} />
          </Routes>
        </div>
        {showFooterRoutes.includes(location.pathname) && <Footer />}
      </div>
    </div>
  );
}
