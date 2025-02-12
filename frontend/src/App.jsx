import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Card from "./components/Card";
import User from './components/User';
import Library from './components/Library';
import jsonData from './data/lecture1-test.json';


export default function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Card words={jsonData.blocks[0]?.words} />} />
        <Route path="/library" element={<Library />} />
        <Route path="/user" element={<User />} /> 
      </Routes>
      <Footer />
    </div>
  );
}