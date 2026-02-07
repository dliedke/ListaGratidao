// Firebase configuration - replace with your own project credentials
// See: https://console.firebase.google.com → Project Settings → Web App
const firebaseConfig = {
    apiKey: "AIzaSyD_xVBC5US7H005CjpFlmF5NMkuGgT1xlY",
    authDomain: "listagratidao.firebaseapp.com",
    databaseURL: "https://listagratidao-default-rtdb.firebaseio.com",
    projectId: "listagratidao",
    storageBucket: "listagratidao.firebasestorage.app",
    messagingSenderId: "321203127279",
    appId: "1:321203127279:web:51f504be1e03da56b2ec1a",
    measurementId: "G-4L1ZXEYW1L"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
