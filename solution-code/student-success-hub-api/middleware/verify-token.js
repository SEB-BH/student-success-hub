const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
      return res.status(401).json({ err: 'Authorization header required.' })
    }

    const token = authorizationHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded.payload
    next()
  } catch (err) {
    res.status(401).json({ err: 'Invalid token.' })
  }
}

module.exports = verifyToken
