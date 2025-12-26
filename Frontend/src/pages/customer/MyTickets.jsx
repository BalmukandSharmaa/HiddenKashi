import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMessageSquare, FiClock, FiCheckCircle } from 'react-icons/fi';
import { apiService } from '../../services/apiService';

const MyTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    try {
      const response = await apiService.getMySupportTickets();
      setTickets(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'status-open',
      'in_progress': 'status-progress', 
      resolved: 'status-resolved',
      closed: 'status-closed',
    };
    return colors[status] || 'status-closed';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600', 
      high: 'text-orange-600',
      urgent: 'text-red-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>;
      case 'in_progress':
        return <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>;
      case 'resolved':
        return <FiCheckCircle className="text-green-600 w-5 h-5" />;
      case 'closed':
        return <FiCheckCircle className="text-gray-600 w-5 h-5" />;
      default:
        return <FiClock className="text-gray-600 w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/customer/dashboard')}
          className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors duration-300"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" /> 
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 animate-fadeIn">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              My Support Tickets
            </h1>
            <p className="text-gray-600">Track and manage your support requests</p>
          </div>
          <button
            onClick={() => navigate('/customer/support')}
            className="btn-primary mt-4 md:mt-0 flex items-center gap-2"
          >
            <FiMessageSquare /> New Ticket
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {tickets.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center animate-slideUp">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
              <FiMessageSquare className="text-4xl text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No Support Tickets</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You haven't submitted any support tickets yet. If you need help, don't hesitate to reach out!
            </p>
            <button
              onClick={() => navigate('/customer/support')}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <FiMessageSquare /> Create Your First Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket, index) => (
              <div key={ticket._id} className="card p-8 animate-slideUp hover:shadow-2xl" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    {getStatusIcon(ticket.status)}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{ticket.subject}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
                          #{ticket._id.slice(-8)}
                        </span>
                        <span className={`font-bold uppercase tracking-wide ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority} Priority
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock className="w-4 h-4" />
                          {new Date(ticket.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(ticket.status)}`}>
                    {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </span>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl mb-6 border-l-4 border-blue-500">
                  <p className="text-gray-700 leading-relaxed">{ticket.description}</p>
                </div>

                {ticket.messages && ticket.messages.length > 1 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-3">Conversation:</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {ticket.messages.slice(1).map((msg, index) => (
                        <div key={index} className={`p-3 rounded-lg ${msg.sender === ticket.user ? 'bg-blue-50 mr-8' : 'bg-gray-100 ml-8'}`}>
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-medium">
                              {msg.sender === ticket.user ? 'You' : 'Support Team'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(msg.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t text-sm text-gray-500">
                  <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
                  {ticket.status === 'resolved' && (
                    <span className="text-green-600">
                      ✓ Resolved {ticket.resolvedAt ? new Date(ticket.resolvedAt).toLocaleDateString() : ''}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;