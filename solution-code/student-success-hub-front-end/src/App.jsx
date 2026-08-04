import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'

import Nav from './components/Nav'
import Assignments from './pages/Assignments'
import Cart from './pages/Cart'
import Dashboard from './pages/Dashboard'
import EditStudent from './pages/EditStudent'
import Landing from './pages/Landing'
import NewStudent from './pages/NewStudent'
import Shop from './pages/Shop'
import SignInForm from './pages/SignInForm'
import SignUpForm from './pages/SignUpForm'
import StudentDetails from './pages/StudentDetails'
import StudentList from './pages/StudentList'

import * as authService from './services/auth'
import * as rewardService from './services/rewards'
import * as studentService from './services/students'

import './App.css'

const App = () => {
  const [user, setUser] = useState(authService.getUser())
  const [students, setStudents] = useState([])
  const [rewards, setRewards] = useState([])
  const [cart, setCart] = useState([])

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsData = await studentService.index()
        setStudents(studentsData)
      } catch (err) {
        console.log(err)
      }
    }

    if (user) {
      fetchStudents()
    } else {
      setStudents([])
    }
  }, [user])

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
      setCart([])
    }
  }, [user])

  const handleAddStudent = async (studentData) => {
    const newStudent = await studentService.create(studentData)
    setStudents([newStudent, ...students])
    return newStudent
  }

  const handleUpdateStudent = async (studentId, studentData) => {
    const updatedStudent = await studentService.update(studentId, studentData)

    setStudents(students.map((student) => {
      if (student._id === studentId) return updatedStudent
      return student
    }))

    return updatedStudent
  }

  const handleDeleteStudent = async (studentId) => {
    await studentService.deleteStudent(studentId)
    setStudents(students.filter((student) => student._id !== studentId))
  }

  const handleCheckInAdded = (studentId, newCheckIn) => {
    setStudents(students.map((student) => {
      if (student._id === studentId) {
        return {
          ...student,
          checkIns: [...student.checkIns, newCheckIn],
        }
      }

      return student
    }))
  }

  const handleAssignmentUpdate = (updatedStudent) => {
    setStudents(students.map((student) => {
      if (student._id === updatedStudent._id) return updatedStudent
      return student
    }))
  }

  const handleAddToCart = (reward) => {
    const alreadyInCart = cart.some((cartReward) => {
      return cartReward._id === reward._id
    })

    if (alreadyInCart) return

    setCart([...cart, reward])
  }

  const handleRemoveFromCart = (rewardId) => {
    setCart(cart.filter((reward) => reward._id !== rewardId))
  }

  const handleClearCart = () => {
    setCart([])
  }

  return (
    <>
      <Nav
        user={user}
        setUser={setUser}
        cart={cart}
      />

      <div className='app-shell'>
        <Routes>
          <Route
            path='/'
            element={
              user
                ? <Dashboard user={user} students={students} />
                : <Landing />
            }
          />

          {user ? (
            <>
              <Route
                path='/students'
                element={<StudentList students={students} user={user} />}
              />
              <Route
                path='/students/:studentId'
                element={
                  <StudentDetails
                    user={user}
                    handleDeleteStudent={handleDeleteStudent}
                    handleCheckInAdded={handleCheckInAdded}
                  />
                }
              />
              <Route
                path='/students/new'
                element={
                  user.role === 'admin'
                    ? <NewStudent handleAddStudent={handleAddStudent} />
                    : <Navigate to='/students' />
                }
              />
              <Route
                path='/students/:studentId/edit'
                element={
                  user.role === 'admin'
                    ? (
                      <EditStudent
                        handleUpdateStudent={handleUpdateStudent}
                      />
                    )
                    : <Navigate to='/students' />
                }
              />
              <Route
                path='/assignments'
                element={
                  user.role === 'admin'
                    ? (
                      <Assignments
                        students={students}
                        handleAssignmentUpdate={handleAssignmentUpdate}
                      />
                    )
                    : <Navigate to='/' />
                }
              />
              <Route
                path='/shop'
                element={
                  <Shop
                    rewards={rewards}
                    cart={cart}
                    handleAddToCart={handleAddToCart}
                  />
                }
              />
              <Route
                path='/cart'
                element={
                  <Cart
                    cart={cart}
                    students={students}
                    handleRemoveFromCart={handleRemoveFromCart}
                    handleClearCart={handleClearCart}
                  />
                }
              />
            </>
          ) : (
            <>
              <Route
                path='/sign-up'
                element={<SignUpForm setUser={setUser} />}
              />
              <Route
                path='/sign-in'
                element={<SignInForm setUser={setUser} />}
              />
            </>
          )}

          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </div>
    </>
  )
}

export default App
