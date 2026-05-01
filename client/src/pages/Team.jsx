import { useState, useEffect } from 'react';
import { Users, Mail, Shield, ShieldCheck } from 'lucide-react';
import userService from '../services/user.service';
import { toast } from 'react-hot-toast';
import { clsx } from 'clsx';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
        <p className="text-gray-500">Manage your organization's users and roles.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">User</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Email</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Role</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={clsx(
                          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mr-3",
                          user.role === 'admin' ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600"
                        )}>
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Mail size={14} className="mr-2" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {user.role === 'admin' ? (
                          <span className="flex items-center px-2.5 py-1 bg-primary-100 text-primary-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                            <ShieldCheck size={12} className="mr-1" />
                            Admin
                          </span>
                        ) : (
                          <span className="flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                            <Shield size={12} className="mr-1" />
                            Member
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
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

export default Team;
