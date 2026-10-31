import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <>
    <div className='flex justify-between'>
      <h1 className='px-3'>Task Manager</h1>
      <div className='flex gap-3 px-4'>
        <Link to='/register'>Register</Link>
        <Link to='/login'>Login</Link>
      </div>
    </div>
    </>
  )
}

export default LandingPage
