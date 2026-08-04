<h1>
  <span class="prefix">Building a MERN Application</span>
  <span class="headline">Student Success Hub</span>
</h1>

## About

In this module, we will turn our completed JWT authentication applications into a small Student Success Hub. Instructors can manage students, record progress check-ins, assign students to instructors, and view a dashboard. The app also includes a rewards shop with a front-end shopping cart.

This is an integration lesson. We are not rebuilding authentication. We will clone the completed Express and React auth projects and add new features to them.

By the end of this module, students will have practiced:

- Extending an existing MERN application
- Using useful Mongoose schema options
- Choosing between embedded data and referenced data
- Protecting back-end actions with authentication and roles
- Building CRUD pages with reusable React forms
- Collecting data and calculating dashboard values
- Lifting shopping-cart state to `App.jsx`

## Content

| Lesson | Skills |
| --- | --- |
| [Setup](./setup/README.md) | Clone and rename the completed auth projects. |
| [Plan the App](./plan-the-app/README.md) | Connect user stories, models, routes, and components. |
| [Add User Roles](./add-user-roles/README.md) | Add a role to users and JWT payloads. |
| [Expand the Student Model](./expand-the-student-model/README.md) | Use schema options, arrays, references, and an embedded schema. |
| [Build the Student API](./build-the-student-api/README.md) | Add protected CRUD routes for students. |
| [Add Embedded Check-Ins](./add-embedded-check-ins/README.md) | Create and display embedded check-in data. |
| [Assign Students](./assign-students/README.md) | Reference and populate an instructor. |
| [Connect the React Front End](./connect-the-react-front-end/README.md) | Fetch protected student data into React state. |
| [Build Student Pages](./build-student-pages/README.md) | Display student lists and details. |
| [Build a Reusable Student Form](./build-a-reusable-student-form/README.md) | Reuse one controlled form for create and update. |
| [Collect Check-In Data](./collect-check-in-data/README.md) | Add check-ins and immediately update the page. |
| [Build the Dashboard](./build-the-dashboard/README.md) | Calculate useful summaries with array methods. |
| [Build the Assignment Page](./build-the-assignment-page/README.md) | Assign students using a controlled select. |
| [Add the Rewards API](./add-the-rewards-api/README.md) | Seed and retrieve reward data. |
| [Build the Shopping Cart](./build-the-shopping-cart/README.md) | Lift cart state and calculate a total. |
| [Protect Admin Actions](./protect-admin-actions/README.md) | Enforce permissions on the server and reflect them in React. |
| [Level Up](./level-up/README.md) | Extend embedded CRUD, charts, and checkout behavior. |

## References

📖 [Reference Materials](./references/README.md)


### Prerequisites

- Completed JWT Authentication in Express APIs lesson
- Completed JWT Authentication in React lesson
- Express REST APIs
- Mongoose relationships and embedded schemas
- React Router
- Controlled forms
- Fetching data in React
- Lifting state with arrays

### Starting point

Students should clone their completed back-end and front-end auth repositories. No separate starter app is provided because the purpose of the setup is to practice extending an existing codebase.

### Included reference solution

- [`student-success-hub-api`](./solution-code/student-success-hub-api/README.md)
- [`student-success-hub-front-end`](./solution-code/student-success-hub-front-end/README.md)


🏗️ [Release Notes](./internal-resources/release-notes.md)
