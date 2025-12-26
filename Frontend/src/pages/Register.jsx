import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiBriefcase } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'customer',
    businessName: '',
    businessLicense: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
      
      <div className="max-w-md w-full mx-auto space-y-8 relative z-10">
        <div className="glass-card rounded-3xl p-8 shadow-2xl animate-slideUp">
        <div className="text-center animate-slideUp" style={{animationDelay: '0.1s'}}>
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-float">
              <span className="text-2xl text-white font-bold">SK</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600">
            Join Swagatam Kashi and start exploring
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-green-600 hover:text-green-700 transition-colors duration-200">
              Sign in here
            </Link>
          </p>
        </div>

        <form className="space-y-6 animate-slideUp" style={{animationDelay: '0.2s'}} onSubmit={handleSubmit}>
          {error && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-2xl animate-slideUp shadow-lg">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="fullName"
                  type="text"
                  required
                  className="input-field pl-10"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  required
                  className="input-field pl-10"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="phone"
                  type="tel"
                  required
                  className="input-field pl-10"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I am a
              </label>
              <select
                name="role"
                className="input-field"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="customer">Customer</option>
                <option value="hotel_owner">Hotel/Tour Owner</option>
              </select>
            </div>

            {formData.role === 'hotel_owner' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <div className="relative">
                    <FiBriefcase className="absolute left-3 top-3 text-gray-400" />
                    <input
                      name="businessName"
                      type="text"
                      required
                      className="input-field pl-10"
                      placeholder="Business Name"
                      value={formData.businessName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business License Number
                  </label>
                  <input
                    name="businessLicense"
                    type="text"
                    required
                    className="input-field"
                    placeholder="License Number"
                    value={formData.businessLicense}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  required
                  className="input-field pl-10"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="input-field pl-10"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
