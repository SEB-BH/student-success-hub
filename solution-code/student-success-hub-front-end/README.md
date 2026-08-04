# Student Success Hub Front End

This is the complete React reference solution for the Student Success Hub lesson. It keeps `user` state in `App.jsx` and passes data through props; it does not use `useContext()`.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The Express API should be running at the URL stored in `VITE_BACK_END_SERVER_URL`.

The API must be seeded before rewards appear:

```bash
cd ../student-success-hub-api
npm run seed
```
