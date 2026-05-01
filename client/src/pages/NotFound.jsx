import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="text-amber-500" size={40} />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <h2 className="text-xl font-medium text-gray-600 mb-8">Oops! Page not found.</h2>
      <p className="text-gray-500 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved. 
        Let's get you back on track.
      </p>
      <Link to="/" className="btn btn-primary flex items-center">
        <Home size={18} className="mr-2" />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
