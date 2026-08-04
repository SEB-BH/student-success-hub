const express = require('express')

const Student = require('../models/student')
const User = require('../models/user')
const verifyToken = require('../middleware/verify-token')
const isAdmin = require('../middleware/is-admin')

const router = express.Router()

router.get('/', verifyToken, async (req, res) => {
  try {
    const students = await Student.find()
      .populate('assignedInstructor', 'username role')
      .sort({ createdAt: -1 })

    res.json(students)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

router.get('/:studentId', verifyToken, async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId)
      .populate('assignedInstructor', 'username role')
      .populate('checkIns.createdBy', 'username role')

    if (!student) {
      return res.status(404).json({ err: 'Student not found.' })
    }

    res.json(student)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const student = await Student.create(req.body)
    res.status(201).json(student)
  } catch (err) {
    res.status(400).json({ err: err.message })
  }
})

router.put('/:studentId', verifyToken, isAdmin, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.studentId,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedInstructor', 'username role')

    if (!student) {
      return res.status(404).json({ err: 'Student not found.' })
    }

    res.json(student)
  } catch (err) {
    res.status(400).json({ err: err.message })
  }
})

router.delete('/:studentId', verifyToken, isAdmin, async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(
      req.params.studentId
    )

    if (!deletedStudent) {
      return res.status(404).json({ err: 'Student not found.' })
    }

    res.json(deletedStudent)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

router.post('/:studentId/check-ins', verifyToken, async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId)

    if (!student) {
      return res.status(404).json({ err: 'Student not found.' })
    }

    const checkInData = {
      confidence: req.body.confidence,
      note: req.body.note,
      needsSupport: req.body.needsSupport,
      createdBy: req.user._id,
    }

    student.checkIns.push(checkInData)
    await student.save()

    await student.populate('checkIns.createdBy', 'username role')

    const newCheckIn = student.checkIns[student.checkIns.length - 1]

    res.status(201).json(newCheckIn)
  } catch (err) {
    res.status(400).json({ err: err.message })
  }
})

router.put(
  '/:studentId/assignment',
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      let assignedInstructor = null

      if (req.body.instructorId) {
        const instructor = await User.findOne({
          _id: req.body.instructorId,
          role: 'instructor',
        })

        if (!instructor) {
          return res.status(400).json({ err: 'Instructor not found.' })
        }

        assignedInstructor = instructor._id
      }

      const student = await Student.findByIdAndUpdate(
        req.params.studentId,
        { assignedInstructor: assignedInstructor },
        { new: true, runValidators: true }
      ).populate('assignedInstructor', 'username role')

      if (!student) {
        return res.status(404).json({ err: 'Student not found.' })
      }

      res.json(student)
    } catch (err) {
      res.status(400).json({ err: err.message })
    }
  }
)

module.exports = router
