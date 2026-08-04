const dotenv = require('dotenv')
dotenv.config()

const mongoose = require('mongoose')
const Reward = require('../models/reward')
const rewards = require('../data/rewards')

const seedRewards = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    await Reward.deleteMany()
    await Reward.create(rewards)
    console.log('Rewards seeded successfully.')
  } catch (err) {
    console.log(err)
  } finally {
    await mongoose.disconnect()
  }
}

seedRewards()
