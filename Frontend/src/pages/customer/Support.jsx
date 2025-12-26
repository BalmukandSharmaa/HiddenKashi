import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import { apiService } from '../../services/apiService';

const CustomerSupport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await apiService.createSupportTicket(formData);
      alert('Support ticket submitted successfully!');
      navigate('/customer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit support ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/customer/dashboard')}
          className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors duration-300"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" /> 
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="glass-card rounded-3xl p-8 md:p-12 animate-slideUp">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
              <FiSend className="text-white text-3xl" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Get Support
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Need assistance? Our support team is here to help you with any questions or issues you might have. 
              We typically respond within 24 hours.
            </p>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 animate-fadeIn">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Priority Level
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="low">🟢 Low - General inquiry</option>
                  <option value="medium">🟡 Medium - Need assistance</option>
                  <option value="high">🟠 High - Urgent issue</option>
                  <option value="urgent">🔴 Urgent - Critical problem</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Detailed Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className="input-field resize-none"
                placeholder="Please provide detailed information about your issue, including any relevant booking references..."
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <FiSend className={loading ? 'animate-pulse' : ''} /> 
                {loading ? 'Submitting...' : 'Submit Support Request'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/customer/dashboard')}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;