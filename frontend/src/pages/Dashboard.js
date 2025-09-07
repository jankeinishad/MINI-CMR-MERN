import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');

  const load = async () => {
    const res = await api.get('/customers');
    setCustomers(res.data.data);
  };
async function deleteCustomer(id) {
  if (!window.confirm("Are you sure you want to delete this customer?")) return;
  await api.delete(`/customers/${id}`);
  load(); 
}

  const add = async (e) => {
    e.preventDefault();
    if (!name) return;
    await api.post('/customers', { name });
    setName('');
    load();
  };

  useEffect(() => { load(); }, []);

  return (
<div className="container mt-4">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h2 className="fw-bold">Customers</h2>
    <form onSubmit={add} className="d-flex">
      <input className="form-control me-2" placeholder="Customer name"
             value={name} onChange={e=>setName(e.target.value)}/>
      <button className="btn btn-primary">Add</button>
    </form>
  </div>

  <div className="card shadow">
    <div className="card-body">
      <table className="table table-hover">
        <thead className="table-primary">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c=>(
            <tr key={c._id}>
              <td><Link to={`/customers/${c._id}`} className="fw-bold">{c.name}</Link></td>
              <td>{c.email || "-"}</td>
              <td>{c.company || "-"}</td>
              <td>
                <Link to={`/customers/${c._id}`} className="btn btn-sm btn-info me-2">View</Link>
                <button
  className="btn btn-sm btn-danger"
  onClick={() => deleteCustomer(c._id)}
>
  Delete
</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>


  );
}
