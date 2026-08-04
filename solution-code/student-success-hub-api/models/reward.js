const mongoose = require('mongoose')

const rewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  points: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    enum: ['privilege', 'resource', 'swag'],
    default: 'privilege',
  },
  available: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true })

const Reward = mongoose.model('Reward', rewardSchema)

module.exports = Reward
