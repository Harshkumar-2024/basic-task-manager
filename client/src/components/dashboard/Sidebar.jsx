
import { House, LogOut, UserRound ,Menu,X} from 'lucide-react'
import {useState} from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {

  const [isOpen, setIsOpen] = useState(false);

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
    <>
    {/* Mobile hamburger button */}
    <button
      onClick={() => setIsOpen(true)}
      className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-[var(--color-primary)] text-white"
      aria-label="Open sidebar"
    >
      <Menu size={24} />
    </button>

    {/* Mobile overlay */}
    {isOpen && (
      <div
        onClick={() => setIsOpen(false)}
        className="md:hidden fixed inset-0 bg-black/40 z-40"
      />
    )}

    {/* Sidebar */}
    <div className={`w-64 h-screen fixed top-0 left-0 flex flex-col bg-[var(--color-primary)] z-50 transition-transform duration-300
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >

      <button
        onClick={() => setIsOpen(false)}
        className="md:hidden absolute top-4 right-4 text-white p-1"
        aria-label="Close sidebar">
        <X size={22} />
      </button>

      <div className="px-7 py-4">
        <h1 className='font-semibold font-sans text-3xl text-center text-white'>
          Task Manager
        </h1>
      </div>

      <div className="px-7 pt-8 pb-4 flex flex-col gap-3">

        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={()=> setIsOpen(false)}
              className={({ isActive }) =>
              `flex items-center w-full p-2.5 rounded-lg transition-all duration-200
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

      <button onClick={handleLogout} className='flex w-full items-center px-10 py-4 mt-auto hover:bg-[var(--color-sidebar-hover)] cursor-pointer transition-all duration-200 ' >
        <LogOut stroke='white'/>
        <h3 className='text-center text-white pl-4'>Logout</h3>
      </button>

    </div>

    </>
  )
}

export default Sidebar
