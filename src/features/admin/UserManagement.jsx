import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { 
  Users, 
  Search, 
  Shield, 
  Ban, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    const usersQuery = query(
      collection(db, 'profiles'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const usersData = [];
      snapshot.forEach((doc) => {
        usersData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setUsers(usersData);
      setLoading(false);
    });

    return unsubscribe;
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'profiles', userId), {
        role: newRole,
        updatedAt: new Date()
      });
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const updateUserStatus = async (userId, suspended) => {
    try {
      await updateDoc(doc(db, 'profiles', userId), {
        suspended,
        suspendedAt: suspended ? new Date() : null,
        updatedAt: new Date()
      });
      toast.success(`User ${suspended ? 'suspended' : 'unsuspended'} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const updateKYCStatus = async (userId, kycStatus) => {
    try {
      const updates = {
        kycStatus,
        updatedAt: new Date()
      };

      if (kycStatus === 'approved') {
        updates.role = 'owner';
        updates.kycApprovedAt = new Date();
      }

      await updateDoc(doc(db, 'profiles', userId), updates);
      toast.success(`KYC status updated to ${kycStatus}`);
    } catch (error) {
      console.error('Error updating KYC status:', error);
      toast.error('Failed to update KYC status');
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete user profile
      await deleteDoc(doc(db, 'profiles', userId));
      
      // Delete related data (bookings, listings, etc.)
      const collections = ['bookings', 'listings', 'kycRequests'];
      for (const collectionName of collections) {
        const q = query(collection(db, collectionName), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      }

      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'owner':
        return 'bg-blue-100 text-blue-800';
      case 'buyer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getKYCStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'suspended' && user.suspended) ||
                         (filter === 'active' && !user.suspended) ||
                         (filter === 'kyc_pending' && user.kycStatus === 'pending') ||
                         user.role === filter;
    
    return matchesSearch && matchesFilter;
  });

  const UserModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>User Details</span>
              <Button variant="ghost" onClick={onClose}>×</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-sm">{user.displayName || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <p className="text-sm">{user.phoneNumber || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="buyer">Buyer</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">KYC Status</label>
                <select
                  value={user.kycStatus || 'not_required'}
                  onChange={(e) => updateKYCStatus(user.id, e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="not_required">Not Required</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs ${user.suspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {user.suspended ? 'Suspended' : 'Active'}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateUserStatus(user.id, !user.suspended)}
                  >
                    {user.suspended ? 'Unsuspend' : 'Suspend'}
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Address</label>
              <p className="text-sm">{user.address || 'Not provided'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Bio</label>
              <p className="text-sm">{user.bio || 'Not provided'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Created At</label>
                <p className="text-sm">{format(user.createdAt?.toDate() || new Date(), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Login</label>
                <p className="text-sm">
                  {user.lastLogin ? format(user.lastLogin.toDate(), 'MMM d, yyyy') : 'Never'}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => deleteUser(user.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete User
              </Button>
              <Button onClick={onClose}>Close</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center space-x-2">
          <Users className="h-6 w-6" />
          <span>User Management</span>
        </h2>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              {['all', 'active', 'suspended', 'admin', 'owner', 'buyer', 'kyc_pending'].map((filterOption) => (
                <Button
                  key={filterOption}
                  variant={filter === filterOption ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(filterOption)}
                >
                  {filterOption.replace('_', ' ').charAt(0).toUpperCase() + filterOption.replace('_', ' ').slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">User</th>
                  <th className="text-left p-4 font-medium text-gray-700">Role</th>
                  <th className="text-left p-4 font-medium text-gray-700">KYC Status</th>
                  <th className="text-left p-4 font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 font-medium text-gray-700">Created</th>
                  <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.displayName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <Users className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{user.displayName || 'Unnamed User'}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getKYCStatusColor(user.kycStatus)}`}>
                        {user.kycStatus?.replace('_', ' ').charAt(0).toUpperCase() + user.kycStatus?.replace('_', ' ').slice(1) || 'Not Required'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        {user.suspended ? (
                          <Ban className="h-4 w-4 text-red-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        <span className="text-sm">
                          {user.suspended ? 'Suspended' : 'Active'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {format(user.createdAt?.toDate() || new Date(), 'MMM d, yyyy')}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateUserStatus(user.id, !user.suspended)}
                        >
                          {user.suspended ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Ban className="h-4 w-4 text-red-600" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Modal */}
      {showUserModal && (
        <UserModal
          user={selectedUser}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;
