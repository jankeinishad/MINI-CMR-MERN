const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Customer = require('../models/Customer');
const Lead = require('../models/Lead');

router.post('/', auth, async (req, res) => {
  const { name, email, phone, company } = req.body;
  const customer = new Customer({ name, email, phone, company, ownerId: req.user._id });
  await customer.save();
  res.json(customer);
});

router.get('/', auth, async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 10);
  const q = req.query.q || '';
  const filter = { ownerId: req.user._id };
  if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }];
  const total = await Customer.countDocuments(filter);
  const data = await Customer.find(filter).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
  res.json({ data, page, totalPages: Math.ceil(total / limit), total });
});

router.get('/:id', auth, async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).json({ message: 'Not found' });
  const leads = await Lead.find({ customerId: customer._id });
  res.json({ customer, leads });
});

router.put('/:id', auth, async (req, res) => {
  const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', auth, async (req, res) => {
  await Lead.deleteMany({ customerId: req.params.id });
  await Customer.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

router.post('/:id/leads', auth, async (req, res) => {
  const { title, description, status = 'New', value = 0 } = req.body;
  const lead = new Lead({ customerId: req.params.id, title, description, status, value });
  await lead.save();
  res.json(lead);
});

router.put('/:id/leads/:leadId', auth, async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.leadId, req.body, { new: true });
  res.json(lead);
});

router.delete('/:id/leads/:leadId', auth, async (req, res) => {
  await Lead.findByIdAndDelete(req.params.leadId);
  res.json({ message: 'Lead deleted' });
});

module.exports = router;
