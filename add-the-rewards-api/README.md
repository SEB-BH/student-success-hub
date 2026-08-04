<h1>
  <span class="headline">Student Success Hub</span>
  <span class="subhead">Add the Rewards API</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to seed a collection and expose its data through a protected index route.

## Create the reward model

Create `models/reward.js` in the Express app:

```javascript
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
```

## Add seed data

Create `data/rewards.js`:

```javascript
module.exports = [
  {
    name: 'Choose the Warm-Up',
    description: 'Choose the class warm-up activity for one day.',
    points: 20,
    category: 'privilege',
  },
  {
    name: 'Pair Programming Pass',
    description: 'Choose your pair for one lab session.',
    points: 35,
    category: 'privilege',
  },
  {
    name: 'Study Notebook',
    description: 'A notebook for planning and study notes.',
    points: 50,
    category: 'resource',
  },
  {
    name: 'Course Sticker Pack',
    description: 'A small pack of course stickers.',
    points: 25,
    category: 'swag',
  },
]
```

Create `scripts/seed-rewards.js`:

```javascript
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
```

Add a script to the back-end `package.json`:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "seed": "node scripts/seed-rewards.js"
}
```

Run it:

```bash
npm run seed
```

> 🚨 This seed deletes existing rewards before creating the example data. It does not delete users or students.

## Add the rewards router

Create `controllers/rewards.js`:

```javascript
const express = require('express')
const router = express.Router()

const Reward = require('../models/reward')
const verifyToken = require('../middleware/verify-token')

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
```

Mount it in `server.js`:

```javascript
const rewardsRouter = require('./controllers/rewards')

app.use('/rewards', rewardsRouter)
```

Test `GET /rewards` in Postman with a Bearer token.

## Fetch rewards in React

Create `src/services/rewards.js`:

```javascript
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/rewards`

const index = async () => {
  const response = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  const data = await response.json()

  if (!response.ok) throw new Error(data.err)

  return data
}

export { index }
```

In `App.jsx`, add state and import the service:

```javascript
const [rewards, setRewards] = useState([])
```

Add a separate effect:

```javascript
useEffect(() => {
  const fetchRewards = async () => {
    try {
      const rewardData = await rewardService.index()
      setRewards(rewardData)
    } catch (err) {
      console.log(err)
    }
  }

  if (user) {
    fetchRewards()
  } else {
    setRewards([])
  }
}, [user])
```

The next microlesson will display this state and add cart behavior.
