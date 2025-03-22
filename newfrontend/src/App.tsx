import './App.css'
import Header from './components/Header';
import LoginCard from './components/LoginCard';
// import Card from './components/Card';
// import { JsonData } from './types/dataTypes';
import { fetchUserInfo } from './functions/fetchUserInfo';
import { useState, useEffect } from 'react';
import { UserLogin } from './types/dataTypes';


export default function App() {
  const [userInfo, setUserInfo] = useState<UserLogin | null>(null);

  useEffect(() => {
    const getUserInfo = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const user = await fetchUserInfo(); 
          console.log(user)
          setUserInfo(user);           
        } catch (error) {
          console.error('Token invalid or expired', error);
          setUserInfo(null); 
        }
      } else {
        setUserInfo(null); 
      }
    };

    getUserInfo();
  }, []);


  return (
    <div className="flex flex-col items-center min-h-screen w-full max-w-[900px] min-w-[320px] mx-auto">
        <Header></Header>
        {userInfo ? <h1>Hello {userInfo.username}!</h1> : <LoginCard />}
    </div>
  );
}
