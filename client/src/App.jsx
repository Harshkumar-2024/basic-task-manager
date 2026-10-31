import {BrowserRouter,Routes,Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'

function App() {
  

  return (
    <>
     {/* <h1 className="text-center text-3xl font-bold">Hello</h1> */}
    <AuthProvider>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<LandingPage/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/dashboard'
               element={<ProtectedRoute>
               <Dashboard/>
               </ProtectedRoute>}/>
            <Route path="/profile"
                element={<ProtectedRoute>
                <Profile />
              </ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </>
  )
}

export default App
