import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ConfirmPage from './Components/Thank_you/ConfirmPage.jsx';
import ThankYouPage from './Components/Thank_you/ThankYouPage.jsx';
import ChefDashboard from './Components/ChefDashboard/ChefDashboard.jsx';
import WaiterDashboard from './Components/waiter/WaiterDashboard.jsx';
import WebsiteQR from './Components/QR/WebsiteQR.jsx';
import TableQRList from './Components/QR/TableQRList.jsx';
import AdminLogin from './Components/Admin/AdminLogin.jsx';
import AdminRegisterForm from './Components/Admin/AdminRegisterForm.jsx';
import StaffLogin from './Components/Staff/StaffLogin.jsx';
import CustomerMenuPage from './Components/Customer/CustomerMenuPage.jsx'; // ✅ New component
import HomePage from './Components/Home/HomePage.jsx';                     // ✅ Home page for admin/staff

function App() {
  return (
    <div className="App">
     <HomePage />

      <Routes>
        <Route path="/" element={<CustomerMenuPage />} />

        {/* 👇 Admin/staff website homepage with login buttons */}
        {/* <Route path="/home" element={<HomePage />} /> */}

        <Route path="/confirm" element={<ConfirmPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/chef" element={<ChefDashboard />} />
        <Route path="/waiter" element={<WaiterDashboard />} />
        <Route path="/qr" element={<WebsiteQR url={"https://qr-dine-five.vercel.app/"} />} />
        <Route path="/qr-tables" element={<TableQRList baseUrl={"https://qr-dine-five.vercel.app/"} />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register-staff" element={<AdminRegisterForm />} />
        <Route path="/staff-login" element={<StaffLogin />} />
      </Routes>
    </div>
  );
}

export default App;