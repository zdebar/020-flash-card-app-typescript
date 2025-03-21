import './App.css'
import Header from './components/Header';
import { RegisterCard } from './components/RegisterCard';
// import Card from './components/Card';
// import jsonData from './data/de-test.json';
// import { JsonData } from './types/dataTypes';


export default function App() {
  // const data = jsonData as JsonData;
  return (
    <div className="flex flex-col items-center min-h-screen w-full max-w-[900px] min-w-[320px] mx-auto">
        <Header></Header>
        <RegisterCard></RegisterCard>
    </div>
  );
}
