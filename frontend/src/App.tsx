import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Card from './components/Card';
import User from './components/User';
import History from './components/History';
import Repetition from './components/Repetition';
import jsonData from './data/lecture1-test.json';

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

  return (
    <div className="app flex-column m-auto">
      <Header />
      <Routes>
        <Route path="/" element={<Card words={data.blocks[0]?.words} />} />
        <Route path="/repetition" element={<Repetition />} />
        <Route path="/history" element={<History />} />
        <Route path="/user" element={<User />} /> 
      </Routes>
      <Footer />
    </div>
  );
}
