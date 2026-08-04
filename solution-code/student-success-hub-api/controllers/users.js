const express = require('express')

const User = require('../models/user')
const verifyToken = require('../middleware/verify-token')
const isAdmin = require('../middleware/is-admin')

const router = express.Router()

router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' })
      .select('username role')
      .sort({ username: 1 })

    res.json(instructors)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

module.exports = router
