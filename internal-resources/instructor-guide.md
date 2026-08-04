<h1>
  <span class="headline">Student Success Hub</span>
  <span class="subhead">Instructor Guide</span>
</h1>

## Purpose

This is a synthesis module, not an introduction to every concept it uses. Students begin with the two applications they completed during the JWT authentication lessons and extend them into a connected MERN application.

The repeated patterns are intentional. Service functions and controller actions remain verbose so students can see each request clearly before they consider refactoring.

## Required starting point

Students need two working repositories:

- A completed Express API with JWT sign-up, sign-in, `verifyToken`, and a `User` model
- A completed React authentication app with sign-up, sign-in, sign-out, persisted `user` state, and React Router

The examples assume the simplified React auth version where `user` state lives in `App.jsx` and is passed through props. If your class kept `UserContext`, the feature code is the same, but students may read `user` from context instead.

Before teaching, make the clone URLs for both completed class repositories available. The setup intentionally uses placeholders because repository locations differ by cohort.

## Suggested pacing

This module is too large for a single short lecture. A comfortable sequence is:

| Block | Microlessons | Suggested time |
| --- | --- | ---: |
| Back-end foundation | Setup through Build the Student API | 2.5-3 hours |
| Relationships | Check-Ins through Assign Students | 2-2.5 hours |
| React CRUD | Connect React through Student Form | 3-4 hours |
| Data features | Check-Ins through Assignment Page | 2.5-3 hours |
| Cart and permissions | Rewards through Protect Admin Actions | 2-2.5 hours |

Pause for short labs after the student API, student pages, and dashboard.

## Recommended checkpoints

1. Both cloned auth apps still work before students change anything.
2. A signed-in request can retrieve students in Postman.
3. A check-in is stored inside its parent student.
4. `assignedInstructor` changes from an ObjectId to a user object after `populate()`.
5. React can refresh without losing the signed-in user.
6. The dashboard handles an empty student array without returning `NaN`.
7. Admin-only requests return `403` for an instructor token.

## Creating an admin account

Public sign-up always creates an instructor. This is deliberate: a user must not be able to grant themselves admin access.

For class, create a normal account and change its `role` to `admin` in MongoDB Atlas or Compass. Sign out and sign in again afterward so a new JWT is created with the updated role.

Create at least one additional instructor account for the assignment feature.

## Data setup

Use Postman or the React form to create three or more students. Give them different statuses, attendance values, skills, and check-ins so dashboard calculations are visible.

Run the included reward seed after the reward model is built:

```bash
npm run seed
```

## Important teaching points

### Embedded versus referenced data

- A check-in is embedded because it belongs to one student and is normally read with that student.
- An instructor is referenced because one user can be assigned to several students and still exists independently.

### Front-end roles are not security

React hides admin controls to make the interface clearer. The Express middleware performs the real authorization check.

### Dashboard calculations

Keep the first dashboard on the front end. `filter()`, `map()`, and `reduce()` make the relationship between the fetched data and the displayed summary easy to see. MongoDB aggregation is a useful later level-up.

### Shopping cart scope

The core cart is intentionally temporary. It lives in React state, prevents duplicate rewards, calculates a point total, and clears after a simulated request. Orders, inventory, and payment processing are outside this lesson's scope.

## Common issues

| Problem | Likely cause |
| --- | --- |
| Every protected request returns `401` | Missing `Bearer` prefix, missing token, or different JWT secrets |
| An admin still sees instructor behavior | The user did not sign in again after the database role changed |
| Assignment dropdown is empty | No instructor accounts exist, or the users route is admin-protected and the current user is not an admin |
| `assignedInstructor.username` crashes | The field is `null`; use optional chaining |
| Dashboard displays `NaN` | Averages did not guard against an empty array |
| A new check-in appears only after refresh | Local student state was not updated after the service returned |
| Student form sends one long skill | Split the comma-separated string before sending it to the API |

## Reference solution

The `solution-code` directory contains separate back-end and front-end applications. It is for instructor reference and troubleshooting; students should build by extending their cloned auth projects.
