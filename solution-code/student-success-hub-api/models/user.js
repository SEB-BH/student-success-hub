const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['instructor', 'admin'],
    default: 'instructor',
  },
}, { timestamps: true })

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.password
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
