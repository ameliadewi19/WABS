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
import TemplateMessage from './components/TemplateMessage.js';

function App() {
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
            <>
              <Navbar />
              <Sidebar />
              <Dashboard />
              <Footer />
            </>
          }
        />
        <Route
          path="/autentikasi-wbm"
          element={
            <>
              <Navbar />
              <Sidebar />
              <Autentikasi />
              <Footer />
            </>
          }
        />
        <Route
          path="/recipient"
          element={
            <>
              <Navbar />
              <Sidebar />
              <Recipient />
              <Footer />
            </>
          }
        />
        <Route
          path="/direct-message"
          element={
            <>
              <Navbar />
              <Sidebar />
              <DirectMessage />
              <Footer />
            </>
          }
        />
        <Route
          path="/schedule-message"
          element={
            <>
              <Navbar />
              <Sidebar />
              <ScheduleMessage />
              <Footer />
            </>
          }
        />
        <Route
          path="/aktivitas"
          element={
            <>
              <Navbar />
              <Sidebar />
              <Aktivitas />
              <Footer />
            </>
          }
        />
        <Route
          path="/template"
          element={
            <>
              <Navbar />
              <Sidebar />
              <TemplateMessage />
              <Footer />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
