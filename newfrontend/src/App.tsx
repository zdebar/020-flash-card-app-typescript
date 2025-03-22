import './App.css'
import Header from './components/Header';
import Card from './components/Card';
import Footer from './components/Footer';
import jsonData from './data/lecture1-test.json';

export default function App() {
  const data = jsonData as JsonData;
  return (
    <div className="flex flex-col items-center justify-between min-h-screen w-full max-w-[900px] min-w-[320px] mx-auto">
      <Header></Header>
      <Card words={data.blocks[0]?.words}></Card>
      <Footer></Footer>
    </div>
  );
}
