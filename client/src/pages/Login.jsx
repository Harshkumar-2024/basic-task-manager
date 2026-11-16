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
    <div className="flex flex-col justify-center items-center min-h-screen bg-[var(--color-secondary)] px-4 py-8">
      {/* center container */}
        <div className="bg-white w-full max-w-md px-6 sm:px-8 py-8 border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-card)]">
        <h1 className='text-center text-2xl font-bold text-[var(--color-primary)] pb-8'>Login your Account</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <h3 className='font-semibold'>Email</h3>
          <input type="email" name='email' placeholder='xyz@gmail.com' value={email} onChange={handleChange} required
          className="w-full border border-[var(--color-border)] rounded-lg h-11 px-3 outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition"/>
          <h3 className='font-semibold'>Password</h3>
          <div className="relative">
            <input type={showPassword?'text':'password'} name='password' placeholder='Minimum 8 characters' value={password} onChange={handleChange} required
            className="border border-[var(--color-border)] rounded-lg h-11 px-3 w-full pr-12 outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition"/>
            <button type='button' 
            onClick={()=>setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-primary)]"
            >{showPassword ? <EyeOff size={21}/>:<Eye size={21}/>}</button>
          </div>

          {error && <p className='text-red-600 text-center text-sm'>{error}</p>}

          <button type='submit' disabled={submitting} className="bg-[var(--color-primary)] border border-[var(--color-primary)] rounded-lg px-3 py-3 text-white font-semibold my-2 hover:bg-[var(--color-sidebar-hover)] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
            {submitting ? 'Logging in..':'Login'}
          </button>
        </form>

        <p className="pt-2 text-center text-[var(--color-muted)] text-sm font-medium">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[var(--color-accent)] font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
        </div>

    </div>
  )
}

export default Login
