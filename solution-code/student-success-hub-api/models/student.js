const mongoose = require('mongoose')

const checkInSchema = new mongoose.Schema({
  confidence: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  note: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
  },
  needsSupport: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true })

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  favoriteFood: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'needs support', 'completed'],
    default: 'active',
  },
  attendance: {
    type: Number,
    min: 0,
    max: 100,
    default: 100,
  },
  skills: [{
    type: String,
    trim: true,
  }],
  assignedInstructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  checkIns: [checkInSchema],
}, { timestamps: true })

const Student = mongoose.model('Student', studentSchema)

module.exports = Student
