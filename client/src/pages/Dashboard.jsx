import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ListTodo,
  TrendingUp,
  Calendar
} from 'lucide-react';
import dashboardService from '../services/dashboard.service';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { clsx } from 'clsx';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );

  const statCards = [
    { label: 'Total Projects', value: stats?.totalProjects, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Tasks', value: stats?.totalTasks, icon: ListTodo, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'In Progress', value: stats?.inProgressTasks, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Completed', value: stats?.completedTasks, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending', value: stats?.pendingTasks, icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50' },
    { label: 'Overdue', value: stats?.overdueTasksCount, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500">Here's what's happening in your workspace today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="card p-4 flex flex-col items-center text-center">
            <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center mb-3", card.bg, card.color)}>
              <card.icon size={20} />
            </div>
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Recent Tasks</h3>
            <button className="text-sm text-primary-600 font-semibold hover:underline">View All</button>
          </div>
          <div className="divide-y divide-gray-50">
            {stats?.recentTasks?.length > 0 ? (
              stats.recentTasks.map((task) => (
                <div key={task._id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{task.title}</span>
                    <span className="text-xs text-gray-500">{task.project?.title}</span>
                  </div>
                  <span className={clsx(
                    "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full",
                    {
                      'bg-gray-100 text-gray-600': task.status === 'todo',
                      'bg-blue-100 text-blue-600': task.status === 'in-progress',
                      'bg-emerald-100 text-emerald-600': task.status === 'completed',
                    }
                  )}>
                    {task.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 italic">No tasks found</div>
            )}
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="card border-red-100">
          <div className="px-6 py-4 border-b border-red-50 flex justify-between items-center bg-red-50/50">
            <h3 className="font-bold text-red-900 flex items-center">
              <AlertCircle size={18} className="mr-2" />
              Overdue Tasks
            </h3>
            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
              {stats?.overdueTasksCount}
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {stats?.overdueTasksList?.length > 0 ? (
              stats.overdueTasksList.map((task) => (
                <div key={task._id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{task.title}</span>
                    <div className="flex items-center text-xs text-red-500 mt-0.5">
                      <Calendar size={12} className="mr-1" />
                      {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    {task.project?.title}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 italic">No overdue tasks! Good job.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
