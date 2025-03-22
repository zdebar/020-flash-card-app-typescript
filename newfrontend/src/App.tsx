import './App.css'
import Header from './components/Header';
import LoginCard from './components/LoginCard';
import RegisterCard from './components/RegisterCard';
// import Card from './components/Card';
// import { JsonData } from './types/dataTypes';
import { fetchUserInfo } from './functions/fetchUserInfo';
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserLogin } from './types/dataTypes';


export default function App() {
  const [userInfo, setUserInfo] = useState<UserLogin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const user = await fetchUserInfo(); 
          console.log(user)
          setUserInfo(user);
          setLoading(false);           
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
        <Routes>
          <Route 
            path="/" 
            element={
              loading ? <p>Loading...</p> : 
              userInfo && Object.keys(userInfo).length > 0 ? <h1>Hello {userInfo.username}</h1> : <Navigate to="/login" />
            } 
          />
          <Route path="/login" element={<LoginCard />} />
          <Route path="/register" element={<RegisterCard />} />
        </Routes>
    </div>
  );
}
