import { Menu, User, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-gray-100 lg:px-8 glass">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-gray-500 rounded-md lg:hidden hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>
        <h1 className="ml-4 text-lg font-semibold text-gray-900 lg:ml-0 truncate max-w-[150px] sm:max-w-none">
          Welcome back, {user?.name}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* User Badge */}
        <div className="flex items-center space-x-3 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-gray-900 leading-tight">{user?.name}</p>
            <span className={({
              'admin': 'text-[10px] uppercase tracking-wider font-bold text-primary-600',
              'member': 'text-[10px] uppercase tracking-wider font-bold text-gray-500'
            })[user?.role]}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
