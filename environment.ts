// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: 'AIzaSyDkg1Kn05tauOZ_svwDHhgR0AiagoDTyEw',
//   authDomain: 'ifarm-12212.firebaseapp.com',
//   projectId: 'ifarm-12212',
//   storageBucket: 'ifarm-12212.firebasestorage.app',
//   messagingSenderId: '1016974952765',
//   appId: '1:1016974952765:web:d5b087ab792982e3f7dd54',
//   measurementId: 'G-0F8P628WL0',
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDkg1Kn05tauOZ_svwDHhgR0AiagoDTyEw',
    authDomain: 'ifarm-12212.firebaseapp.com',
    projectId: 'ifarm-12212',
    storageBucket: 'ifarm-12212.firebasestorage.app',
    messagingSenderId: '1016974952765',
    appId: '1:1016974952765:web:d5b087ab792982e3f7dd54',
    measurementId: 'G-0F8P628WL0',
  },
};
