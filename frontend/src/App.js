import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar.js';
import Sidebar from './components/Sidebar.js';
import Footer from './components/Footer.js';
import Login from './components/Login.js';
import Dashboard from './components/Dashboard.js';
import Autentikasi from './components/Autentikasi.js';
import Recipient from './components/Recipient.js';
import DirectMessage from './components/DirectMessage.js';
import ScheduleMessage from './components/ScheduleMessage.js';
import Aktivitas from './components/Aktivitas.js';


function checkAuthorization() {
  const token = localStorage.getItem('jwt_token');

  console.log("token lokal:", token);
  
  if (!token) {
    return false;
  }
  return true;
}

function ProtectedRoute({ children }) {
  const location = useLocation();

  const userHasAuthorization = checkAuthorization(); 

  if (!userHasAuthorization) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Login />
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="wrapper">
                  <Sidebar />
                <div className="main">
                    <Navbar/>
                    <Dashboard />
                    <Footer />
                </div>  
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/autentikasi-wbm"
          element={
            <ProtectedRoute>
            <div className="wrapper">
                <Sidebar />
              <div className="main">
                  <Navbar/>
                  <Autentikasi />
                  <Footer />
              </div>  
            </div>
          </ProtectedRoute>
          }
        />
        <Route
          path="/recipient"
          element={
            <ProtectedRoute>
            <div className="wrapper">
                <Sidebar />
              <div className="main">
                  <Navbar/>
                  <Recipient />
                  <Footer />
              </div>  
            </div>
          </ProtectedRoute>
          }
        />
        <Route
          path="/direct-message"
          element={
            <ProtectedRoute>
            <div className="wrapper">
                <Sidebar />
              <div className="main">
                  <Navbar/>
                  <DirectMessage />
                  <Footer />
              </div>  
            </div>
          </ProtectedRoute>
          }
        />
        <Route
          path="/schedule-message"
          element={
            <ProtectedRoute>
            <div className="wrapper">
                <Sidebar />
              <div className="main">
                  <Navbar/>
                  <ScheduleMessage />
                  <Footer />
              </div>  
            </div>
          </ProtectedRoute>
          }
        />
        <Route
          path="/aktivitas"
          element={
            <ProtectedRoute>
            <div className="wrapper">
                <Sidebar />
              <div className="main">
                  <Navbar/>
                  <Aktivitas />
                  <Footer />
              </div>  
            </div>
          </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
