const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/serviceRequest.model');
const { auth, authorize } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Create service request
router.post('/', auth, upload.array('attachments', 5), async (req, res) => {
  try {
    const { type, description, priority, location } = req.body;
    
    const attachments = req.files?.map(file => ({
      filename: file.filename,
      path: file.path,
      uploadedAt: new Date()
    })) || [];

    const serviceRequest = new ServiceRequest({
      customerId: req.user._id,
      type,
      description,
      priority,
      location,
      attachments
    });

    await serviceRequest.save();
    res.status(201).json(serviceRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating service request', error: error.message });
  }
});

// Get all service requests (for support staff and admin)
router.get('/all', auth, authorize('support', 'admin'), async (req, res) => {
  try {
    const { status, priority, type } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (type) filter.type = type;

    const requests = await ServiceRequest.find(filter)
      .populate('customerId', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName')
      .sort('-createdAt');
      
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service requests', error: error.message });
  }
});

// Get user's service requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ customerId: req.user._id })
      .populate('assignedTo', 'firstName lastName')
      .sort('-createdAt');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your service requests', error: error.message });
  }
});

// Update service request status
router.patch('/:id/status', auth, authorize('support', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    request.status = status;
    if (status === 'resolved') {
      request.resolvedAt = new Date();
    }

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error updating service request', error: error.message });
  }
});

// Add comment to service request
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    request.comments.push({
      user: req.user._id,
      text
    });

    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
});

// Assign service request to support staff
router.patch('/:id/assign', auth, authorize('admin'), async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    request.assignedTo = assignedTo;
    request.status = 'assigned';

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error assigning service request', error: error.message });
  }
});

module.exports = router; 