import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { tasksAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
    const { user } = useAuth();
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
            const statsResponse = await tasksAPI.getTaskStats();
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
            pending: 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200',
            'in-progress': 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-200',
            completed: 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-200'
        };
        return colors[status] || 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-gray-200';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-200',
            medium: 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-200',
            high: 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 border-orange-200',
            urgent: 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-200'
        };
        return colors[priority] || 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 border-slate-200';
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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="container mx-auto px-4 pt-8 pb-20">
                    <div className="max-w-md mx-auto bg-white rounded-2xl -lg border border-red-100 p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-black to-[#001E80] bg-clip-text text-transparent mb-4">
                            Something went wrong
                        </h2>
                        <p className="text-[#010D3E] text-lg mb-8 tracking-tight">{error}</p>
                        <button
                            onClick={fetchDashboardData}
                            className="btn btn-primary w-full"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-x-clip">
            <div className="container mx-auto px-4 pt-8 pb-20">
                {/* Welcome Section */}
                <div className="mb-12">
                    <div className="inline-flex items-center px-3 py-1 rounded-lg border border-[#222]/10 mb-6">
                        <span className="text-sm font-medium text-[#010D3E]">
                            Welcome back
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-r from-black to-[#001E80] bg-clip-text text-transparent mb-6">
                        {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}!
                    </h1>
                    <p className="text-[#010D3E] text-xl tracking-tight max-w-2xl">
                        Here&apos;s what&apos;s happening with your tasks today. Celebrate the joy of accomplishment and track your progress.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl -lg border border-[#222]/10 p-8 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/tasks/new" className="btn btn-primary">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create Task
                        </Link>
                        <Link to="/tasks" className="btn btn-secondary">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            View All Tasks
                        </Link>
                        <Link to="/profile" className="btn btn-text">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile Settings
                        </Link>
                    </div>
                </div>

                {/* Statistics Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <div className="bg-white rounded-2xl -lg border border-[#222]/10 p-6 hover:-xl transition- duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Total Tasks</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl -lg border border-[#222]/10 p-6 hover:-xl transition- duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                                    <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl -lg border border-[#222]/10 p-6 hover:-xl transition- duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
                                    <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl -lg border border-[#222]/10 p-6 hover:-xl transition- duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Overdue</p>
                                    <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-xl">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Tasks */}
                <div className="bg-white rounded-2xl -lg border border-[#222]/10 overflow-hidden">
                    <div className="p-8 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Recent Tasks</h2>
                            <Link to="/tasks" className="btn btn-text">
                                View all
                            </Link>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {recentTasks.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No tasks yet</h3>
                                <p className="text-gray-600 text-lg mb-8">Get started by creating your first task and begin your productivity journey</p>
                                <Link to="/tasks/new" className="btn btn-primary">
                                    Create Task
                                </Link>
                            </div>
                        ) : (
                            recentTasks.map((task) => (
                                <div key={task._id} className="p-6 hover:bg-gray-50 transition-all duration-200 transform hover:translateZ(0)">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-lg border text-sm font-medium ${getTaskStatusColor(task.status)}`}>
                                                    {task.status.replace('-', ' ')}
                                                </span>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-lg border text-sm font-medium ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                            </div>

                                            {task.description && (
                                                <p className="text-gray-600 text-base mb-3 line-clamp-2 leading-relaxed">
                                                    {task.description}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                                <span>Updated {formatDate(task.updatedAt)}</span>
                                                {task.dueDate && (
                                                    <span className={isOverdue(task.dueDate) ? 'text-red-600 font-semibold' : ''}>
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
                                            className="btn btn-text ml-4"
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
        </div>
    );
};

export default Dashboard;