
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {

  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: ''
  });

  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (formData.password.length < 8) {
      setError('Password must be contain at least 8 characters');
      return;
    }

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setSubmitting(true);

      await registerUser(formData);

      navigate('/login');

    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed.Please try again');

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[var(--color-secondary)] px-4 py-8">

      {/* Registration card */}
      <div className="bg-white w-full max-w-md px-6 sm:px-8 py-8 border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-card)]">

        <h1 className="text-center text-2xl font-bold text-[var(--color-primary)] pb-8">
          Create your Account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <h3 className="font-semibold text-[var(--color-text)]">
            Full Name
          </h3>

          <input
            type="text"
            name="fullname"
            placeholder="Full name"
            value={formData.fullname}
            onChange={handleChange}
            required
            className="w-full border border-[var(--color-border)] rounded-lg h-11 px-3 outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition"
          />

          <h3 className="font-semibold text-[var(--color-text)]">
            Email
          </h3>

          <input
            type="email"
            name="email"
            placeholder="xyz@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-[var(--color-border)] rounded-lg h-11 px-3 outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition"
          />

          <h3 className="font-semibold text-[var(--color-text)]">
            Password
          </h3>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              required
              className="border border-[var(--color-border)] rounded-lg h-11 px-3 w-full pr-12 outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-primary)]"
            >
              {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
            </button>
          </div>

          <h3 className="font-semibold text-[var(--color-text)]">
            Confirm Password
          </h3>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repeat your Password"
              value={confirmPassword}
              onChange={handleConfirmPassword}
              required
              className="border border-[var(--color-border)] rounded-lg h-11 px-3 w-full pr-12 outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-primary)]"
            >
              {showConfirmPassword ? <EyeOff size={21} /> : <Eye size={21} />}
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-center text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-[var(--color-primary)] border border-[var(--color-primary)] rounded-lg px-3 py-3 text-white font-semibold my-2 hover:bg-[var(--color-sidebar-hover)] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating account..' : 'Create account'}
          </button>

        </form>

        <p className="pt-2 text-center text-[var(--color-muted)] text-sm font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[var(--color-accent)] font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
