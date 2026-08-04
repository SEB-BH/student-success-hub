<h1>
  <span class="headline">Student Success Hub</span>
  <span class="subhead">Setup</span>
</h1>

**Learning objective:** By the end of this lesson, students will be able to clone and rename their completed JWT auth applications so they can extend them into a new project.

## Start from completed authentication

We are not creating two empty applications. We already built and tested authentication, so we will use that work as our starting template.

You need the completed repositories from the previous lessons:

- Express API with JWT authentication
- React front end with JWT authentication

Both apps should already support sign-up, sign-in, sign-out, and persisted sessions.

> 🚨 Do not continue until authentication works in both completed apps. It is much easier to fix an auth problem before adding new features.

## Clone the completed back end

Navigate to the directory where you keep lecture code:

```bash
cd ~/code/ga/lectures
```

Copy the clone URL from your class's completed Express auth repository. Clone it into a new directory:

```bash
git clone <completed-express-auth-repo-url> student-success-hub-api
```

Move into the new directory:

```bash
cd student-success-hub-api
```

The cloned project still points to the old auth repository. Remove that Git history, then start a fresh repository:

```bash
rm -rf .git
git init
git add .
git commit -m "initial auth template"
```

> 🚨 Before running `rm -rf .git`, use `pwd` and make sure you are inside `student-success-hub-api`.

Install dependencies:

```bash
npm install
```

Create a new `.env` file because secrets are not included when a repository is cloned:

```bash
touch .env
```

Add your own values:

```plaintext
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_string
PORT=3000
```

Use a new database name such as `student-success-hub`. This keeps the new app's data separate from the original auth lesson.

Start the server:

```bash
npm run dev
```

## Clone the completed front end

Open a second terminal and return to the lectures directory:

```bash
cd ~/code/ga/lectures
```

Clone the completed React auth repository into a new directory:

```bash
git clone <completed-react-auth-repo-url> student-success-hub-front-end
cd student-success-hub-front-end
```

Start a fresh Git history:

```bash
rm -rf .git
git init
git add .
git commit -m "initial auth template"
```

Install dependencies:

```bash
npm install
```

Create the front-end `.env` file:

```bash
touch .env
```

Add the back-end URL:

```plaintext
VITE_BACK_END_SERVER_URL=http://localhost:3000
```

Start the React app:

```bash
npm run dev
```

## Test the starting point

Before adding anything new:

1. Create a user through the React sign-up form.
2. Sign out.
3. Sign in with the same account.
4. Refresh the page and confirm the user stays signed in.
5. Confirm the browser console and both terminals are free of errors.

## Code conventions in this module

The examples in this module use the class's simplified auth structure:

- `user` state lives in `App.jsx`.
- `setUser` is passed to the sign-up and sign-in pages through props.
- Components are stored directly inside `src/components`.
- Route-level components are stored directly inside `src/pages`.
- Service functions are grouped by resource inside `src/services`.
- React imports come from `react-router`.
- The code does not use `useContext()`.

If your completed auth app has slightly different filenames, keep your existing names and place the new logic in the equivalent file.

## Make a checkpoint

Once both cloned applications work, make a commit in each repository:

```bash
git add .
git commit -m "confirm auth starting point"
```
