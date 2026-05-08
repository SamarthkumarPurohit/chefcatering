import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import BookingPage from './pages/BookingPage';
import DashboardPage from './pages/DashboardPage';
import DonationsPage from './pages/DonationsPage';
import ChefDashboard from './pages/ChefDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MenuPage from './pages/MenuPage';
import NGOsPage from './pages/NGOsPage';
import ImpactPage from './pages/ImpactPage';
import HireChefPage from './pages/HireChefPage';
import HireBookingPage from './pages/HireBookingPage';
import MyHiresPage from './pages/MyHiresPage';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/ngos" element={<NGOsPage />} />
        <Route path="/impact" element={<ImpactPage />} />
        <Route path="/hire-chef" element={<HireChefPage />} />
        <Route path="/hire-chef/book/:chefId" element={
          <PrivateRoute roles={['customer','admin']}><HireBookingPage /></PrivateRoute>
        } />
        <Route path="/my-hires" element={
          <PrivateRoute roles={['customer','admin']}><MyHiresPage /></PrivateRoute>
        } />
        <Route path="/booking/:serviceId" element={
          <PrivateRoute roles={['customer','admin']}><BookingPage /></PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute roles={['customer']}><DashboardPage /></PrivateRoute>
        } />
        <Route path="/donations" element={
          <PrivateRoute roles={['customer','chef']}><DonationsPage /></PrivateRoute>
        } />
        <Route path="/chef-dashboard" element={
          <PrivateRoute roles={['chef']}><ChefDashboard /></PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>
        } />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
