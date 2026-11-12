import React, { useState } from 'react'
import {Link, useNavigate } from 'react-router-dom'
import {useAuth} from '../context/AuthContext'
import {Eye,EyeOff} from 'lucide-react'

const Login = () => {

  const navigate = useNavigate();
  const [error,setError] = useState('');
  const [submitting,setSubmitting] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");

  const {login} = useAuth();

  const [showPassword,setShowPassword] = useState(false);

  const handleSubmit = async (e) =>{
    e.preventDefault();

    setError('');

    if(password.length < 8){
      setError('Password must contain at least 8 characters')
      return;
    }

    try{
      setSubmitting(true);

      await login({email,password});

      navigate('/dashboard');
    }catch(error){
      setError(error.response?.data?.message || 'Login failed.Please try again');
    }finally{
      setSubmitting(false);
    }
  }

  const handleChange = (e) =>{
    const {name,value} = e.target;

    if(name=='email'){
      setEmail(value);
    }
    if(name=='password'){
      setPassword(value);
    }

  }


  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#006f7fe8] px-4 py-8">
      {/* center container */}
        <div className="bg-amber-50 w-full max-w-md px-8 py-8 border rounded-xl shadow-lg">
        <h1 className='text-center text-2xl font-bold pb-8'>Login your Account</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <h3 className='font-semibold'>Email</h3>
          <input type="email" name='email' placeholder='xyz@gmail.com' value={email} onChange={handleChange} required
          className='border-1 border-gray-500 rounded-md h-[40px] px-2'/>
          <h3 className='font-semibold'>Password</h3>
          <div className="relative">
            <input type={showPassword?'text':'password'} name='password' placeholder='Minimum 8 characters' value={password} onChange={handleChange} required
            className='border-1 border-gray-500 rounded-md h-[40px] px-2 w-full pr-10'/>
            <button type='button' 
            onClick={()=>setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2'
            >{showPassword ? <EyeOff size={28}/>:<Eye size={28}/>}</button>
          </div>

          {error && <p className='text-red-600 text-center text-sm'>{error}</p>}

          <button type='submit' disabled={submitting} className='bg-blue-600 border rounded-xl px-3 py-2 text-white font-semibold my-2 hover:bg-blue-800'>
            {submitting ? 'Logging in..':'Login'}
          </button>
        </form>

        <p className='pt-2 text-center text-gray-600 font-semibold'>Don't have an account? <Link to="/register" className='text-blue-600'>Register</Link></p>
        </div>

    </div>
  )
}

export default Login
