import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Starting login with:', formData.email);
      const response = await login(formData);
      console.log('Login response:', response);
      if (response.success) {
        const user = response.data.user;
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (user.role === 'hotel_owner') {
          navigate('/owner/dashboard');
        } else {
          navigate('/customer/dashboard');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="max-w-md w-full mx-auto space-y-8 relative z-10 flex flex-col justify-center min-h-screen">
        {/* Logo/Brand Section */}
        <div className="text-center animate-slideUp">
          <div className="w-20 h-20 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-float">
            <span className="text-3xl text-white font-bold">SK</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome Back! 👋
          </h2>
          <p className="text-gray-600 text-lg">
            Sign in to continue your journey
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl animate-fadeIn">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="input-field pl-12"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="input-field pl-12"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing you in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            {/* Security Notice */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 0h12a2 2 0 002-2v-9a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">Security Notice</h4>
                  <p className="text-xs text-blue-700">
                    For your security, you'll be automatically logged out after 30 minutes of inactivity. 
                    We'll show a warning 5 minutes before logout.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-300"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Quick Login Demo Section */}
        <div className="text-center text-gray-600 text-sm animate-slideUp" style={{animationDelay: '0.3s'}}>
          <p className="mb-3">Quick Demo Access:</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button 
              onClick={() => setFormData({ email: 'admin@test.com', password: 'password123' })}
              className="bg-green-100 text-green-700 px-4 py-2 rounded-full hover:bg-green-200 transition-colors duration-300 shadow-sm"
            >
              Admin
            </button>
            <button 
              onClick={() => setFormData({ email: 'owner@test.com', password: 'password123' })}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors duration-300 shadow-sm"
            >
              Owner
            </button>
            <button 
              onClick={() => setFormData({ email: 'customer@test.com', password: 'password123' })}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200 transition-colors duration-300 shadow-sm"
            >
              Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
