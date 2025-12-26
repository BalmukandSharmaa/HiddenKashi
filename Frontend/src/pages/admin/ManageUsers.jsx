import { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { FaUsers, FaFilter, FaBan, FaCheckCircle } from 'react-icons/fa';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterRole, searchQuery, users]);

  const fetchAllUsers = async () => {
    try {
      const response = await apiService.getAllUsers();
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    if (filterRole !== 'all') {
      filtered = filtered.filter(u => u.role === filterRole);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleToggleActive = async (userId, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    setProcessingId(userId);
    try {
      await apiService.updateUserStatus(userId, { isActive: !currentStatus });
      alert(`User ${action}d successfully!`);
      fetchAllUsers();
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} user`);
    } finally {
      setProcessingId(null);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      customer: 'bg-blue-100 text-blue-800',
      hotel_owner: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading users...</div>
      </div>
    );
  }

  const customerCount = users.filter(u => u.role === 'customer').length;
  const ownerCount = users.filter(u => u.role === 'hotel_owner').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Users</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-gray-800">{users.length}</p>
          <p className="text-sm text-gray-600">Total Users</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-blue-600">{customerCount}</p>
          <p className="text-sm text-gray-600">Customers</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-purple-600">{ownerCount}</p>
          <p className="text-sm text-gray-600">Hotel Owners</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-red-600">{adminCount}</p>
          <p className="text-sm text-gray-600">Admins</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-600" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="hotel_owner">Hotel Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="flex-1 border border-gray-300 rounded px-4 py-2"
          />

          <div className="text-sm text-gray-600 flex items-center">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FaUsers className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No users found</h2>
          <p className="text-gray-500">Try adjusting the filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                        {user.role === 'hotel_owner' ? 'Hotel Owner' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <FaCheckCircle /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600">
                          <FaBan /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleActive(user._id, user.isActive)}
                          disabled={processingId === user._id}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed ${
                            user.isActive
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {processingId === user._id 
                            ? 'Processing...' 
                            : user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
