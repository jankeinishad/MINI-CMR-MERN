const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  title: String,
  description: String,
  status: { type: String, enum: ['New','Contacted','Converted','Lost'], default: 'New' },
  value: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', LeadSchema);
