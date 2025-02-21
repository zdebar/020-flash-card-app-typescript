import { Routes, Route, useNavigate} from 'react-router-dom'
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Card from './components/Card';
import User from './components/User';
import History from './components/History';
import Repetition from './components/Repetition';
import jsonData from './data/lecture1-test.json';
import Register from './components/Register';

interface Word {
  src: string;
  trg: string;
  prn: string;
}

interface JsonData {
  blocks: {
    words: Word[];
  }[];
}

export default function App() {
  const data = jsonData as JsonData;
  const login = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      login('/login');
    }, 1000);

    return () => clearTimeout(timer);
  }, [login]);

  return (
    <div className="app flex-column m-auto">
      <Header />
      <Routes>
        <Route path="/login" element={<Register />} />
        <Route path="/practice" element={<Card words={data.blocks[0]?.words} />} />
        <Route path="/repetition" element={<Repetition />} />
        <Route path="/history" element={<History />} />
        <Route path="/user" element={<User />} /> 
      </Routes>
      <Footer />
    </div>
  );
}
