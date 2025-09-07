import React, { useState } from 'react';

import api from "../utils/api";
import { saveToken } from '../utils/auth';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

async function submit(e){
  e.preventDefault();
  try {
    await api.post("/auth/register", form);

    // Auto login right after register
    const loginRes = await api.post("/auth/login", {
      email: form.email,
      password: form.password
    });

    localStorage.setItem("token", loginRes.data.token);
    window.location.href = "/";
  } catch(err){
    console.log(err.response?.data);
    setError(err.response?.data?.message || "Registration failed");
  }
}

  return (
<div className="d-flex justify-content-center align-items-center vh-100 bg-light">
  <div className="card shadow p-4" style={{width:"400px"}}>
    <h3 className="text-center mb-3">Register</h3>
    {error && <div className="alert alert-danger">{error}</div>}
    <form onSubmit={submit}>
      <input className="form-control mb-3" placeholder="Name"
             value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <input className="form-control mb-3" placeholder="Email"
             value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
      <input type="password" className="form-control mb-3" placeholder="Password"
             value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
      <button className="btn btn-success w-100">Register</button>
    </form>
  </div>
</div>

  );
}
