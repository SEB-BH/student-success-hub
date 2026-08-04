const express = require('express')

const Reward = require('../models/reward')
const verifyToken = require('../middleware/verify-token')

const router = express.Router()

router.get('/', verifyToken, async (req, res) => {
  try {
    const rewards = await Reward.find({ available: true })
      .sort({ points: 1 })

    res.json(rewards)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

module.exports = router
