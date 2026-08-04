const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const logger = require('morgan')

const authRouter = require('./controllers/auth')
const rewardsRouter = require('./controllers/rewards')
const studentsRouter = require('./controllers/students')
const usersRouter = require('./controllers/users')

const app = express()

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

mongoose.connection.on('error', (err) => {
  console.log(err)
})

app.use(cors())
app.use(express.json())
app.use(logger('dev'))

app.get('/', (req, res) => {
  res.json({ message: 'Student Success Hub API' })
})

app.use('/auth', authRouter)
app.use('/rewards', rewardsRouter)
app.use('/students', studentsRouter)
app.use('/users', usersRouter)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`The Express app is ready on port ${port}.`)
})
