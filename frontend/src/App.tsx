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
import UserLanguages from './components/UserLanguages';
import UserOverview from './components/UserOverview';
import WordList from './components/WordList';

export default function App() {
  const { userInfo } = useUser();
  const location = useLocation();
  const showFooterRoutes = ['/', '/login'];

  return (
    <div className="color-background h-screen">
      <div className="min-card mx-auto flex h-full max-w-[900px] flex-col">
        <Header />
        <div className={`z-1 flex h-full flex-col items-center`}>
          <Routes>
            <Route
              path="/"
              element={
                <div className="flex w-full max-w-[480px] flex-col items-center justify-start gap-4 p-4 text-center">
                  <h1>Jazyky jednoduše</h1>
                  <p className="notice">aplikace v testovacím režimu</p>
                  <p>
                    Trénujte až 1000 slovíček či 500 vět za hodinu, a dosáhněte
                    základní znalosti jazyka za zlomek běžného učebního času.
                  </p>
                  {!userInfo && (
                    <div className="w-card">
                      <ButtonLink to="/login">
                        Přihlášení / Registrace
                      </ButtonLink>
                    </div>
                  )}
                  <p>
                    Rychlé kartičky. Jen poslouchání a mluvení, žádné psaní.
                    Slovíčka i gramatika v jedné sekvenci. Obojí hned
                    procvičováno ve větách.
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
