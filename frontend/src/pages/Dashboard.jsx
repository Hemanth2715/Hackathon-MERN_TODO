import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { tasksAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch task statistics
            const statsResponse = await tasksAPI.getStats();
            setStats(statsResponse.data);

            // Fetch recent tasks (limit to 5)
            const tasksResponse = await tasksAPI.getTasks({
                limit: 5,
                sortBy: 'updatedAt',
                sortOrder: 'desc'
            });
            setRecentTasks(tasksResponse.data.tasks);

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const getTaskStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            'in-progress': 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-orange-100 text-orange-800',
            urgent: 'bg-red-100 text-red-800'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const isOverdue = (dueDate) => {
        if (!dueDate) return false;
        return new Date(dueDate) < new Date() && dueDate !== null;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="btn-primary"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}!
                </h1>
                <p className="text-gray-600 text-lg">
                    Here's what's happening with your tasks today
                </p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <Link to="/tasks/new" className="btn-primary">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create Task
                    </Link>
                    <Link to="/tasks" className="btn-secondary">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        View All Tasks
                    </Link>
                    <Link to="/profile" className="btn-text">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile Settings
                    </Link>
                </div>
            </div>

            {/* Statistics Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">In Progress</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Overdue</p>
                                <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-lg">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
                        <Link to="/tasks" className="text-primary-600 hover:text-primary-700 font-medium">
                            View all
                        </Link>
                    </div>
                </div>

                <div className="divide-y divide-gray-200">
                    {recentTasks.length === 0 ? (
                        <div className="p-6 text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks yet</h3>
                            <p className="text-gray-500 mb-4">Get started by creating your first task</p>
                            <Link to="/tasks/new" className="btn-primary">
                                Create Task
                            </Link>
                        </div>
                    ) : (
                        recentTasks.map((task) => (
                            <div key={task._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="font-medium text-gray-900">{task.title}</h3>
                                            <span className={`badge ${getTaskStatusColor(task.status)}`}>
                                                {task.status.replace('-', ' ')}
                                            </span>
                                            <span className={`badge ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </div>

                                        {task.description && (
                                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                                {task.description}
                                            </p>
                                        )}

                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span>Updated {formatDate(task.updatedAt)}</span>
                                            {task.dueDate && (
                                                <span className={isOverdue(task.dueDate) ? 'text-red-600 font-medium' : ''}>
                                                    Due {formatDate(task.dueDate)}
                                                </span>
                                            )}
                                            {task.sharedWith && task.sharedWith.length > 0 && (
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    Shared
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <Link
                                        to={`/tasks/${task._id}`}
                                        className="text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 