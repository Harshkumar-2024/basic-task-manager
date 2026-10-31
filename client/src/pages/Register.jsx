import React, { useState } from 'react'
import { useNavigate,Link } from 'react-router-dom';
import { registerUser } from '../api/authApi';

const Register = () => {

  const navigate = useNavigate();

  const [error,setError] = useState('');
  const [submitting,setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
      fullname:'',
      email:'',
      password:''
  });

  const [confirmPassword, setConfirmPassword] = useState('')

  const handleChange= (e) =>{
    const {name,value} = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:value
    }));
  };

  const handleConfirmPassword = (e) =>{
    setConfirmPassword(e.target.value);
  };

  const handleSubmit= async(e) =>{
      e.preventDefault();

      setError('');

      if(formData.password.length < 8){
        setError('Password must be contain at least 8 characters')
        return;
      }
      if(formData.password !== confirmPassword){
        setError('Passwords do not match');
        return;
      }


      try{
          setSubmitting(true);

          await registerUser(formData);

          navigate('/login');

      }catch(error){
          setError(error.response?.data?.message || 'Registration failed.Please try again');

      }finally{
          setSubmitting(false);

      }
  }

  return (

    <div className="flex flex-col justify-center items-center min-h-screen bg-[#006f7fe8] px-4 py-8">
      {/* center container */}
        <div className="bg-amber-50 w-full max-w-md px-8 py-8 border rounded-xl shadow-lg">
        <h1 className='text-center text-2xl font-bold pb-8'>Create your Account</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <h3 className='font-semibold'>Full Name</h3>
          <input type="text" name='fullname' placeholder='Full name' value={formData.fullname} onChange={handleChange} required 
          className='border-1 border-gray-500 rounded-md h-[40px] px-2' />
          <h3 className='font-semibold'>Email</h3>
          <input type="email" name='email' placeholder='xyz@gmail.com' value={formData.email} onChange={handleChange} required
          className='border-1 border-gray-500 rounded-md h-[40px] px-2'/>
          <h3 className='font-semibold'>Password</h3>
          <input type="password" name='password' placeholder='Minimum 8 characters' value={formData.password} onChange={handleChange} required
          className='border-1 border-gray-500 rounded-md h-[40px] px-2'/>
          <h3 className='font-semibold'>Confirm Password</h3>
          <input type="password" placeholder='Repeat your Password' value={confirmPassword} onChange={handleConfirmPassword} required
          className='border-1 border-gray-500 rounded-md h-[40px] px-2'/>
          {error && <p className='text-red-600 text-center text-sm'>{error}</p>}
          <button type='submit' disabled={submitting} className='bg-blue-600 border rounded-xl px-3 py-2 text-white font-semibold my-2 hover:bg-blue-800'>
            {submitting ? 'Creating account..':'Create account'}
          </button>
        </form>

        <p className='pt-2 text-center text-gray-600 font-semibold'>Already have a account? <Link to="/login" className='text-blue-600'>Login</Link></p>
        </div>

    </div>
  );
};

export default Register
