import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: 'AIzaSyD1wLbXeu8Zbv2JQn6w3ILGNmBgp-uphfI',
  authDomain: 'english-app-737f5.firebaseapp.com',
  projectId: 'english-app-737f5',
  storageBucket: 'english-app-737f5.firebasestorage.app',
  messagingSenderId: '237230451124',
  appId: '1:237230451124:web:9521aaa1afe9241245eae1',
  measurementId: 'G-KJLRVM505W',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
