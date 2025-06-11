// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ✅ Firebase config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// ✅ Initialize Firebase app and auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };


// Location restriction logic
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
      const data = await res.json();
      const address = data.address || {};
      const city =
        address.city ||
        address.town ||
        address.village ||
        address.state ||
        '';
      if (city.toLowerCase() !== 'pune') {
        alert('Access restricted: This service is only available in Pune');
      }
    } catch {
      alert('Unable to verify your location. Access denied.');
      
    }
  }, () => {
    alert('Location access denied. Access to this service is restricted to Pune.');
  });
} else {
  alert('Geolocation not supported. Access denied.');
}






