const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['gas_leak', 'connection_issue', 'billing_query', 'new_connection', 'maintenance', 'other']
  },
  status: {
    type: String,
    enum: ['new', 'assigned', 'in_progress', 'resolved', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  description: {
    type: String,
    required: true
  },
  attachments: [{
    filename: String,
    path: String,
    uploadedAt: Date
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolvedAt: Date,
  expectedResolutionDate: Date,
  location: {
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
serviceRequestSchema.index({ customerId: 1, status: 1 });
serviceRequestSchema.index({ assignedTo: 1, status: 1 });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema); 