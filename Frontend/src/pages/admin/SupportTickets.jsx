import { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { FaTicketAlt, FaFilter, FaReply, FaCheckCircle } from 'react-icons/fa';

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchAllTickets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterStatus, tickets]);

  const fetchAllTickets = async () => {
    try {
      const response = await apiService.getAllSupportTickets();
      setTickets(response.data);
      setFilteredTickets(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (filterStatus === 'all') {
      setFilteredTickets(tickets);
    } else {
      setFilteredTickets(tickets.filter(t => t.status === filterStatus));
    }
  };

  const handleReply = async (ticketId) => {
    if (!replyMessage.trim()) {
      alert('Please enter a reply message');
      return;
    }

    setProcessingId(ticketId);
    try {
      await apiService.replyToSupportTicket(ticketId, { message: replyMessage });
      alert('Reply sent successfully!');
      setReplyMessage('');
      setSelectedTicket(null);
      fetchAllTickets();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setProcessingId(null);
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    setProcessingId(ticketId);
    try {
      await apiService.updateSupportTicketStatus(ticketId, { status: newStatus });
      alert(`Ticket ${newStatus} successfully!`);
      fetchAllTickets();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update ticket status');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'in_progress': 'bg-blue-100 text-blue-800 border-blue-300',
      resolved: 'bg-green-100 text-green-800 border-green-300',
      closed: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      urgent: 'text-red-600'
    };
    return colors[priority?.toLowerCase()] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading support tickets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Support Tickets Management
          </h1>
          <p className="text-gray-600 text-lg">Monitor and respond to customer support requests</p>
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

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center animate-slideUp hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">{tickets.filter(t => t.status === 'open').length}</span>
            </div>
            <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">Open Tickets</p>
            <p className="text-yellow-600 text-xs mt-1">Needs attention</p>
          </div>
          <div className="card p-6 text-center animate-slideUp hover:scale-105" style={{animationDelay: '0.1s'}}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">{tickets.filter(t => t.status === 'in_progress').length}</span>
            </div>
            <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">In Progress</p>
            <p className="text-blue-600 text-xs mt-1">Being worked on</p>
          </div>
          <div className="card p-6 text-center animate-slideUp hover:scale-105" style={{animationDelay: '0.2s'}}>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">{tickets.filter(t => t.status === 'resolved').length}</span>
            </div>
            <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">Resolved</p>
            <p className="text-green-600 text-xs mt-1">Completed</p>
          </div>
          <div className="card p-6 text-center animate-slideUp hover:scale-105" style={{animationDelay: '0.3s'}}>
            <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">{tickets.filter(t => t.status === 'closed').length}</span>
            </div>
            <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">Closed</p>
            <p className="text-gray-600 text-xs mt-1">Archived</p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-6 rounded-2xl mb-8 animate-slideUp" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FaFilter className="text-white" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mr-3">Filter by Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="input-field w-auto min-w-[150px]"
                >
                  <option value="all">All Statuses</option>
                  <option value="open">🟡 Open</option>
                  <option value="in_progress">🔵 In Progress</option>
                  <option value="resolved">🟢 Resolved</option>
                  <option value="closed">⚫ Closed</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
              Showing <span className="font-semibold">{filteredTickets.length}</span> of <span className="font-semibold">{tickets.length}</span> tickets
            </div>
          </div>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div className="glass-card p-16 text-center rounded-3xl animate-slideUp" style={{animationDelay: '0.5s'}}>
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
              <FaTicketAlt className="text-4xl text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-3">No tickets found</h3>
            <p className="text-gray-500 mb-6">
              {filterStatus === 'all' 
                ? 'No support tickets have been submitted yet.' 
                : `No tickets with status "${filterStatus}" found. Try adjusting the filters.`
              }
            </p>
            {filterStatus !== 'all' && (
              <button
                onClick={() => setFilterStatus('all')}
                className="btn-secondary"
              >
                Show All Tickets
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
            <div key={ticket._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <FaTicketAlt className="text-2xl text-orange-600 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{ticket.subject}</h3>
                          <span className={`text-sm font-semibold uppercase ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Ticket #{ticket._id.slice(-8)}</p>
                        <p className="text-sm text-gray-600">
                          From: {ticket.user?.fullName} ({ticket.user?.email})
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <p className="text-gray-700">{ticket.description}</p>
                    </div>

                    {ticket.booking && (
                      <p className="text-sm text-gray-600 mb-2">
                        Related Booking: {ticket.booking._id?.slice(-8) || 'N/A'}
                      </p>
                    )}

                    {/* Messages */}
                    {ticket.messages && ticket.messages.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <h4 className="font-semibold text-sm">Conversation:</h4>
                        {ticket.messages.map((msg, index) => (
                          <div key={index} className={`p-3 rounded-lg ${msg.sender === 'admin' ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8'}`}>
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-sm font-medium capitalize">{msg.sender}</span>
                              <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-gray-700">{msg.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Form */}
                    {selectedTicket === ticket._id && (
                      <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                        <textarea
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder="Type your reply..."
                          rows="3"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReply(ticket._id)}
                            disabled={processingId === ticket._id}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                          >
                            {processingId === ticket._id ? 'Sending...' : 'Send Reply'}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTicket(null);
                              setReplyMessage('');
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <p className="text-xs text-gray-500">
                      Created {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {selectedTicket !== ticket._id && (
                    <button
                      onClick={() => setSelectedTicket(ticket._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaReply /> Reply
                    </button>
                  )}

                  {ticket.status === 'open' && (
                    <button
                      onClick={() => handleStatusUpdate(ticket._id, 'in_progress')}
                      disabled={processingId === ticket._id}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:bg-gray-400"
                    >
                      Start Working
                    </button>
                  )}

                  {(ticket.status === 'open' || ticket.status === 'in_progress') && (
                    <button
                      onClick={() => handleStatusUpdate(ticket._id, 'resolved')}
                      disabled={processingId === ticket._id}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                    >
                      <FaCheckCircle /> Mark Resolved
                    </button>
                  )}

                  {ticket.status === 'resolved' && (
                    <button
                      onClick={() => handleStatusUpdate(ticket._id, 'closed')}
                      disabled={processingId === ticket._id}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400"
                    >
                      Close Ticket
                    </button>
                  )}
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTickets;
