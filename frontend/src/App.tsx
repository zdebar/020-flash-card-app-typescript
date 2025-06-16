import './App.css';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      console.log('Custom protocol query:', query);
      // Handle the query parameter (e.g., navigate or perform an action)
    }
  }, [searchParams]);

  return (
    <div className="color-background min-h-screen">
      <div className="max-w-app min-card mx-auto flex h-full w-full flex-col items-center">
        <Header />

        <div className={`app z-1 flex h-full w-full flex-col items-center`}>
          <Routes>
            <Route
              path="/"
              element={
                <div className="font-display flex w-full max-w-[480px] flex-col items-center justify-start gap-4 text-center text-xl">
                  <h1 className="">Angličtina jednoduše</h1>
                  <p className="color-error">aplikace v testovacím režimu</p>
                  <p>Bez lekcí, beze stresu, od slovíček po gramatiku.</p>

                  {!userInfo && (
                    <div className="max-w-card items">
                      <ButtonLink to="/login" className="button-rectangular">
                        Přihlášení / Registrace
                      </ButtonLink>
                    </div>
                  )}

                  <p>
                    Aplikace sama kombinuje učení slovíček a gramatiky. Jedno
                    tlačítko a procvičujte kolikrát denně jenom budete chtít.
                  </p>
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
