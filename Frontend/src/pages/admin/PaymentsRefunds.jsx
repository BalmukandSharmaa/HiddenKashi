import { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { FaMoneyBillWave, FaUndo, FaFilter, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const PaymentsRefunds = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchAllPayments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterStatus, payments]);

  const fetchAllPayments = async () => {
    try {
      const response = await apiService.getAllPayments();
      setPayments(response.data);
      setFilteredPayments(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (filterStatus === 'all') {
      setFilteredPayments(payments);
    } else {
      setFilteredPayments(payments.filter(p => p.status === filterStatus));
    }
  };

  const handleRefund = async (paymentId) => {
    const reason = prompt('Enter refund reason:');
    if (!reason) return;

    setProcessingId(paymentId);
    try {
      await apiService.processRefund(paymentId, { reason });
      alert('Refund processed successfully!');
      fetchAllPayments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process refund');
    } finally {
      setProcessingId(null);
    }
  };

  const handleStatusUpdate = async (paymentId, newStatus) => {
    if (!window.confirm(`Update payment status to ${newStatus}?`)) {
      return;
    }

    setProcessingId(paymentId);
    try {
      await apiService.updatePaymentStatus(paymentId, { status: newStatus });
      alert('Payment status updated successfully!');
      fetchAllPayments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update payment status');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaClock className="text-yellow-600" />,
      completed: <FaCheckCircle className="text-green-600" />,
      failed: <FaTimesCircle className="text-red-600" />,
      refunded: <FaUndo className="text-blue-600" />
    };
    return icons[status?.toLowerCase()] || <FaClock className="text-gray-600" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      failed: 'bg-red-100 text-red-800 border-red-300',
      refunded: 'bg-blue-100 text-blue-800 border-blue-300'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading payments...</div>
      </div>
    );
  }

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRefunded = payments
    .filter(p => p.status === 'refunded')
    .reduce((sum, p) => sum + (p.refund?.amount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Payments & Refunds</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <FaMoneyBillWave className="text-3xl text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <FaUndo className="text-3xl text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Refunded</p>
              <p className="text-2xl font-bold text-blue-600">₹{totalRefunded.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <FaClock className="text-3xl text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-yellow-600">
                {payments.filter(p => p.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center gap-4">
          <FaFilter className="text-gray-600" />
          <div>
            <label className="text-sm font-medium mr-2">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div className="ml-auto text-sm text-gray-600">
            Showing {filteredPayments.length} of {payments.length} payments
          </div>
        </div>
      </div>

      {/* Payments List */}
      {filteredPayments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FaMoneyBillWave className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No payments found</h2>
          <p className="text-gray-500">Try adjusting the filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <div key={payment._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon(payment.status)}
                    <div>
                      <h3 className="font-bold text-lg">Payment #{payment._id.slice(-8)}</h3>
                      <p className="text-sm text-gray-600">
                        Booking ID: {payment.booking?._id?.slice(-8) || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Customer</p>
                      <p className="font-medium">{payment.customer?.name || 'N/A'}</p>
                      <p className="text-gray-500">{payment.customer?.email}</p>
                    </div>

                    <div>
                      <p className="text-gray-600">Payment Details</p>
                      <p className="font-medium capitalize">{payment.method || 'N/A'}</p>
                      {payment.transactionId && (
                        <p className="text-gray-500 text-xs">TXN: {payment.transactionId}</p>
                      )}
                    </div>

                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-medium">{new Date(payment.createdAt).toLocaleDateString()}</p>
                      <p className="text-gray-500 text-xs">{new Date(payment.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  {payment.refund && (
                    <div className="mt-4 pt-4 border-t bg-blue-50 -mx-6 -mb-6 p-4">
                      <p className="font-semibold text-blue-800 mb-2">Refund Information</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <p><span className="text-gray-600">Amount:</span> ₹{payment.refund.amount}</p>
                        <p><span className="text-gray-600">Status:</span> <span className="capitalize">{payment.refund.status}</span></p>
                        <p className="md:col-span-2"><span className="text-gray-600">Reason:</span> {payment.refund.reason}</p>
                        <p className="md:col-span-2 text-xs text-gray-500">
                          Processed on {new Date(payment.refund.processedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="text-3xl font-bold text-orange-600">₹{payment.amount}</p>
                  </div>
                  
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>

                  <div className="flex flex-col gap-2 w-full">
                    {payment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(payment._id, 'completed')}
                          disabled={processingId === payment._id}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                        >
                          {processingId === payment._id ? 'Processing...' : 'Mark Completed'}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(payment._id, 'failed')}
                          disabled={processingId === payment._id}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
                        >
                          Mark Failed
                        </button>
                      </>
                    )}

                    {payment.status === 'completed' && !payment.refund && (
                      <button
                        onClick={() => handleRefund(payment._id)}
                        disabled={processingId === payment._id}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                      >
                        <FaUndo /> {processingId === payment._id ? 'Processing...' : 'Process Refund'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentsRefunds;
