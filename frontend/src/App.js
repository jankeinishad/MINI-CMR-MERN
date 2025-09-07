import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CustomerDetail from './pages/CustomerDetail';
import { getToken, logout } from './utils/auth';

export default function App() {
  const token = getToken();

  return (
    <div>
<nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3 mb-4 shadow">
  <Link className="navbar-brand fw-bold" to="/">Mini CRM</Link>
  <div className="ms-auto d-flex">
    {!token && <Link className="btn btn-outline-light me-2" to="/login">Login</Link>}
    {!token && <Link className="btn btn-light" to="/register">Register</Link>}
    {token && <button className="btn btn-danger" onClick={logout}>Logout</button>}
  </div>
</nav>



      <Routes>
        <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/customers/:id" element={<CustomerDetail />} />
      </Routes>
    </div>
  );
}
