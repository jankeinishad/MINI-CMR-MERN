import React, { useState } from 'react';
import api from '../utils/api';
import { saveToken } from '../utils/auth';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      saveToken(res.data.token);
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  };

  return (
 <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
  <div className="card shadow p-4" style={{width:"400px"}}>
    <h3 className="text-center mb-3">Login</h3>
    {error && <div className="alert alert-danger">{error}</div>}
    <form onSubmit={submit}>
      <input className="form-control mb-3" placeholder="Email"
             value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
      <input type="password" className="form-control mb-3" placeholder="Password"
             value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
      <button className="btn btn-primary w-100">Login</button>
    </form>
  </div>
</div>


  );
}

