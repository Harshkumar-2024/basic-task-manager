
import { House, LogOut, Settings, UserRound } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: House },
    { name: 'Profile', path: '/profile', icon: UserRound },
  ]

  const {logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try{
        await logout()
        navigate('/login',{replace:true})
    }catch(error){
        console.error('Logout failed',error);
    }
  }

  return (
    <div className='w-64 min-h-screen flex flex-col bg-[var(--color-primary)]'>

      <div className="px-7 py-4">
        <h1 className='font-semibold font-sans text-3xl text-center text-white'>
          Task Manager
        </h1>
      </div>

      <div className="px-10 pt-14 pb-4 flex flex-col gap-5">

        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center w-full p-2 rounded-lg transition-all duration-200
                ${isActive
                  ? 'bg-[var(--color-sidebar-active)] border-l-4 border-[var(--color-accent)]'
                  : 'hover:bg-[var(--color-sidebar-hover)]'
                }`
              }
            >
              <Icon stroke='white' />
              <h3 className='text-white pl-4'>{item.name}</h3>
            </NavLink>
          )
        })}

      </div>

      <div className="h-[1.2px] w-3/4 bg-white/20 mx-auto"></div>

      <button onClick={handleLogout} className='flex w-full items-center px-10 py-4 mt-auto hover:bg-[var(--color-sidebar-hover)] cursor-pointer transition-all duration-200 '>
        <LogOut stroke='white'/>
        <h3 className='text-center text-white pl-4'>Logout</h3>
      </button>

    </div>
  )
}

export default Sidebar
