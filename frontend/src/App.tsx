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
import Loading from './components/common/Loading';
import Footer from './components/Footer';

export default function App() {
  const { userInfo, loading } = useUser();
  const location = useLocation();
  const showFooterRoutes = ['/', '/login'];

  return (
    <div className="flex min-h-screen flex-col justify-between dark:bg-gray-900">
      <div className="w-app min-w-card mx-auto flex h-full w-full flex-col items-center">
        <Header />

        <div
          className={`app z-1 flex h-full w-full flex-col items-center gap-1`}
        >
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="font-display m- max-w-[480px] p-4 text-center text-xl">
                    <h1 className="">Angličtina přirozeně</h1>
                    <p className="pb-8 text-red-600">
                      aplikace v testovacím režimu
                    </p>
                    <p className="pb-8">
                      Učte se jazyky přirozeně. Mluvením a posloucháním. Od
                      samostatných slovíček až po celé věty.
                    </p>
                  </div>
                  {loading ? (
                    <Loading />
                  ) : (
                    !userInfo && (
                      <div className="w-card">
                        <ButtonLink to="/login" className="button-rectangular">
                          Přihlášení / Registrace
                        </ButtonLink>
                      </div>
                    )
                  )}
                </>
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
      {showFooterRoutes.includes(location.pathname) && <Footer />}
    </div>
  );
}
