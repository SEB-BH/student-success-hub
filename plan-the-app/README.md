<h1>
  <span class="headline">Student Success Hub</span>
  <span class="subhead">Plan the App</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to connect the app's user stories to its models, routes, and React pages.

## What we are building

The Student Success Hub borrows a few ideas from a CRM without treating students as customers.

| CRM idea | Student Success Hub feature |
| --- | --- |
| Staff roles | Instructor and admin roles |
| Assigned account owner | Assigned instructor |
| Interaction history | Progress check-ins |
| Business dashboard | Student support dashboard |
| Product cart | Rewards cart |

## Core user stories

- As a signed-in instructor, I can view students and their check-in history.
- As a signed-in instructor, I can record a progress check-in.
- As an admin, I can create, update, and delete students.
- As an admin, I can assign students to instructors.
- As a signed-in user, I can view dashboard summaries.
- As a signed-in user, I can add rewards to a cart and submit a simulated request.

## Models

We will use three models:

| Model | Purpose |
| --- | --- |
| `User` | Authentication and staff roles |
| `Student` | The main CRUD resource |
| `Reward` | Items displayed in the rewards shop |

Check-ins are not a separate model. They are embedded inside each student.

## Embedded or referenced?

We will use both relationship patterns.

### Embedded check-ins

A check-in belongs to one student and is normally viewed with that student. It makes sense to store it inside the student document.

```plaintext
Student
  checkIns
    confidence
    note
    needsSupport
    createdBy
```

### Referenced instructor

An instructor exists as a separate user and may be assigned to many students. We will store the user's ObjectId in `assignedInstructor` and use `populate()` when we need the username.

## API routes

### Students

| Method | Path | Action | Access |
| --- | --- | --- | --- |
| `GET` | `/students` | List students | Signed-in |
| `GET` | `/students/:studentId` | Show one student | Signed-in |
| `POST` | `/students` | Create a student | Admin |
| `PUT` | `/students/:studentId` | Update a student | Admin |
| `DELETE` | `/students/:studentId` | Delete a student | Admin |

### Check-ins and assignments

| Method | Path | Action | Access |
| --- | --- | --- | --- |
| `POST` | `/students/:studentId/check-ins` | Add a check-in | Signed-in |
| `PUT` | `/students/:studentId/assignment` | Assign an instructor | Admin |
| `GET` | `/users` | List instructors | Admin |

Updating and deleting check-ins are included as a Level Up.

### Rewards

| Method | Path | Action | Access |
| --- | --- | --- | --- |
| `GET` | `/rewards` | List available rewards | Signed-in |

The first cart lives only in React state, so it does not need a cart API.

## React routes

| Path | Page | Access |
| --- | --- | --- |
| `/` | Landing or dashboard | Everyone |
| `/sign-up` | Sign-up form | Signed-out |
| `/sign-in` | Sign-in form | Signed-out |
| `/students` | Student list | Signed-in |
| `/students/new` | New student | Admin |
| `/students/:studentId` | Student details | Signed-in |
| `/students/:studentId/edit` | Edit student | Admin |
| `/assignments` | Student assignments | Admin |
| `/shop` | Rewards shop | Signed-in |
| `/cart` | Cart | Signed-in |

## State plan

Shared state belongs in `App.jsx`:

- `user`
- `students`
- `rewards`
- `cart`

Form data and one-page messages stay in the component that uses them.

> 🧠 We place state in the closest component that needs to share it. The cart is needed by the nav, shop, and cart pages, so `App.jsx` is the closest shared parent.
