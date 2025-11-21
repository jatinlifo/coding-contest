import React from 'react'
import Login from './components/Login'
import axios from 'axios'
import About from './pages/About'
import Home from './pages/Home'
import Contest from './pages/Contest'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './store/Layout'
import CreateAccount from './components/CreateAccount'
import Profile from './components/Profile'
import Token from './components/Token'
import { AuthProvider } from './context/AuthContext'
import RegisterContest from './pages/RegisterContest'
import CodeEditor from './pages/CodeEditor'
import ProblemList from './pages/ProblemList'
import { ProblemProvider } from './context/ProblemContext'
import { OwnerProvider } from './context/OwnerContext'
import ShowSelectedProblems from './pages/ShowSelectedProblems'

console.log("Problem Provider", ProblemProvider);

function App() {

  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path='/' element={<Home />} />
              <Route path='/user/about' element={<About />} />
              <Route path='/user/login' element={<Login />} />
              <Route path='/user/create-account' element={<CreateAccount />} />
              <Route path='/user/profile' element={<Profile />} />
              <Route path='/token' element={<Token />} />
              <Route path='/user/contest' element={<Contest />} />
              <Route
                path='/user/contest/register-contest'
                element={
                  <OwnerProvider>
                    <RegisterContest />
                  </OwnerProvider>
                }
              />
              <Route
                path='/user/contest/register-contest/select-problems'
                element={
                  <ProblemProvider>
                    <OwnerProvider>
                      <ProblemList />
                    </OwnerProvider>
                  </ProblemProvider>
                }
              />
              <Route
                path='/user/contest/register-contest/select-problems/show-selected-problems'
                element={
                  <ProblemProvider>
                    <ShowSelectedProblems />
                  </ProblemProvider>
                }
              />
              <Route
                path='/user/coding/contest/code-editor'
                element={
                  <ProblemProvider>
                    <CodeEditor />
                  </ProblemProvider>
                }
              />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App