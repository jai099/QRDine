import './App.css';
import { Routes, Route } from 'react-router-dom';
import ConfirmPage from './Components/Thank_you/ConfirmPage.jsx';
import ThankYouPage from './Components/Thank_you/ThankYouPage.jsx';
import ChefDashboard from './Components/ChefDashboard/ChefDashboard.jsx';
import WaiterDashboard from './Components/waiter/WaiterDashboard.jsx';
import WebsiteQR from './Components/QR/WebsiteQR.jsx';
import TableQRList from './Components/QR/TableQRList.jsx';
// OLD LOGIN FILES (optional to remove later)
 import AdminRegisterForm from './Components/Admin/AdminRegisterForm.jsx';
 import CustomerMenuPage from './Components/Customer/CustomerMenuPage.jsx';
import HomePage from './Components/Home/HomePage.jsx';

// ✅ Import the new unified login
import Login from './Pages/Login.jsx';
import AdminLogin from './Components/Admin/AdminLogin.jsx';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<CustomerMenuPage />} />
        <Route path="/confirm" element={<ConfirmPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/chef" element={<ChefDashboard />} />
        <Route path="/waiter" element={<WaiterDashboard />} />
        <Route path="/qr" element={<WebsiteQR url={"https://qr-dine-five.vercel.app/"} />} />
        <Route path="/qr-tables" element={<TableQRList baseUrl={"https://qr-dine-five.vercel.app/"} />} />

        {/* ✅ New Unified Login Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        {/* ✅ Keep only if needed */}
        <Route path="/register-staff" element={<AdminRegisterForm />} />
      </Routes>
    </div>
  );
}

export default App;