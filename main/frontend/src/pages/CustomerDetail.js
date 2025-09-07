import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

export default function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [leads, setLeads] = useState([]);
  const [title, setTitle] = useState("");

  // Edit modal state
  const [editData, setEditData] = useState({ name: "", email: "", phone: "", company: "" });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await api.get(`/customers/${id}`);
    setCustomer(res.data);
    setLeads(res.data.leads || []);
    setEditData({
      name: res.data.name || "",
      email: res.data.email || "",
      phone: res.data.phone || "",
      company: res.data.company || ""
    });
  }
async function deleteLead(leadId) {
  if (!window.confirm("Delete this lead?")) return;
  await api.delete(`/customers/${id}/leads/${leadId}`);
  load();
}

  async function addLead(e) {
    e.preventDefault();
    await api.post(`/customers/${id}/leads`, { title });
    setTitle("");
    load();
  }

  async function updateCustomer(e) {
    e.preventDefault();
    await api.put(`/customers/${id}`, editData);
    load();
    window.bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
  }

  if (!customer) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-body d-flex justify-content-between">
          <div>
            <h2 className="fw-bold">{customer.name}</h2>
            <p className="text-muted">
              Email: {customer.email || "-"} <br />
              Phone: {customer.phone || "-"} <br />
              Company: {customer.company || "-"}
            </p>
          </div>
          <button className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#editModal">
            Edit
          </button>
        </div>
      </div>

      {/* Leads Section */}
      <div className="mt-4">
        <h4 className="fw-bold">Leads</h4>
        <form onSubmit={addLead} className="d-flex mb-3">
          <input className="form-control me-2" placeholder="Lead title"
                 value={title} onChange={e=>setTitle(e.target.value)}/>
          <button className="btn btn-primary">Add Lead</button>
        </form>
     <ul className="list-group shadow">
  {leads.map(l => (
    <li key={l._id} className="list-group-item d-flex justify-content-between align-items-center">
      <span>{l.title}</span>
      <div>
        <span className={`badge me-3 bg-${l.status === "Converted" ? "success" :
                                         l.status === "Lost" ? "danger" :
                                         l.status === "Contacted" ? "warning text-dark" : "secondary"}`}>
          {l.status}
        </span>
        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteLead(l._id)}>
          Delete
        </button>
      </div>
    </li>
  ))}
</ul>

      </div>

      {/* Edit Customer Modal */}
      <div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={updateCustomer}>
              <div className="modal-header">
                <h5 className="modal-title">Edit Customer</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <input className="form-control mb-2" placeholder="Name"
                       value={editData.name} onChange={e=>setEditData({...editData, name:e.target.value})}/>
                <input className="form-control mb-2" placeholder="Email"
                       value={editData.email} onChange={e=>setEditData({...editData, email:e.target.value})}/>
                <input className="form-control mb-2" placeholder="Phone"
                       value={editData.phone} onChange={e=>setEditData({...editData, phone:e.target.value})}/>
                <input className="form-control mb-2" placeholder="Company"
                       value={editData.company} onChange={e=>setEditData({...editData, company:e.target.value})}/>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-success">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
