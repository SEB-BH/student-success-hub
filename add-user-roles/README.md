<h1>
  <span class="headline">Student Success Hub</span>
  <span class="subhead">Add User Roles</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to store a user role and include it in a JWT payload.

## Why add a role?

Authentication answers: **Who is this user?**

Authorization answers: **What is this user allowed to do?**

Both instructors and admins can sign in. Admins will also be allowed to manage and assign students.

## Add `role` to the user schema

Open `models/user.js` in the Express app. Add a `role` property to the existing schema:

```javascript
role: {
  type: String,
  enum: ['instructor', 'admin'],
  default: 'instructor',
},
```

Your existing username and password fields should remain unchanged.

`enum` limits the field to the two listed values. `default` means a new user becomes an instructor when no role is supplied.

## Keep role out of public sign-up

Do not add a role input to the sign-up form. Do not copy `req.body.role` when creating a user.

The existing create code should continue to choose only the expected fields:

```javascript
const user = await User.create({
  username: req.body.username,
  password: bcrypt.hashSync(req.body.password, 10),
})
```

If your completed auth template calls the stored field `hashedPassword`, keep
that name. The only new field in this microlesson is `role`.

Even if someone sends `"role": "admin"` in Postman, the controller ignores it.

> 🚨 Hiding an admin option in React is not enough. The back end must also refuse to use an untrusted role from the request body.

## Add role to both JWT payloads

The React app reads user data from the JWT payload. Add `role` wherever the back end creates a token.

Update the payload in both the sign-up and sign-in controller functions:

```javascript
const payload = {
  _id: user._id,
  username: user.username,
  role: user.role,
}
```

The token can now provide React with an object like this:

```javascript
{
  _id: '66a123...',
  username: 'nabila',
  role: 'instructor'
}
```

## Add admin middleware

Create a new middleware file:

```bash
touch middleware/is-admin.js
```

Add the following:

```javascript
// middleware/is-admin.js

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ err: 'Admin access required.' })
  }

  next()
}

module.exports = isAdmin
```

This middleware assumes `verifyToken` has already added the decoded payload to `req.user`.

The order will matter when we use both middleware functions:

```javascript
router.post('/', verifyToken, isAdmin, async (req, res) => {
  // controller code
})
```

1. `verifyToken` identifies the user.
2. `isAdmin` checks the identified user's role.
3. The controller runs only if both checks pass.

## Create an admin for class

1. Sign up normally.
2. Open the `users` collection in MongoDB Atlas or Compass.
3. Change that user's `role` from `instructor` to `admin`.
4. Sign out and sign in again.

Signing in again is important because the existing token still contains the old role.

## Check the role in React

Temporarily add this line in `App.jsx`:

```javascript
console.log(user)
```

After signing in again, confirm that the object includes `role: 'admin'`.

Remove the `console.log()` when finished.
