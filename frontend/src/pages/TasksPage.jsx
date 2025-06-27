import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';   
import { tasksAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import TaskCard from '../components/TaskCard';
import TaskFilters from '../components/TaskFilters';

const TasksPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // grid, list, kanban
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        totalTasks: 0,
        hasNext: false,
        hasPrev: false
    });

    // Filter and sort state
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        status: searchParams.get('status') || '',
        priority: searchParams.get('priority') || '',
        sortBy: searchParams.get('sortBy') || 'createdAt',
        sortOrder: searchParams.get('sortOrder') || 'desc',
        page: parseInt(searchParams.get('page')) || 1
    });

    useEffect(() => {
        fetchTasks();
    }, [filters]);

    useEffect(() => {
        // Update URL params when filters change
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value.toString());
        });
        setSearchParams(params);
    }, [filters, setSearchParams]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page: filters.page,
                limit: 10,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder
            };

            // Add filters if they have values
            if (filters.search) params.search = filters.search;
            if (filters.status) params.status = filters.status;
            if (filters.priority) params.priority = filters.priority;

            const response = await tasksAPI.getTasks(params);
            setTasks(response.data.tasks);
            setPagination({
                page: response.data.page,
                totalPages: response.data.totalPages,
                totalTasks: response.data.totalTasks,
                hasNext: response.data.hasNext,
                hasPrev: response.data.hasPrev
            });

        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            setError('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: 1 // Reset to first page when filters change
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const handleTaskUpdate = (updatedTask) => {
        setTasks(prev => prev.map(task =>
            task._id === updatedTask._id ? updatedTask : task
        ));
    };

    const handleTaskDelete = (taskId) => {
        setTasks(prev => prev.filter(task => task._id !== taskId));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            status: '',
            priority: '',
            sortBy: 'createdAt',
            sortOrder: 'desc',
            page: 1
        });
    };

    if (loading && tasks.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                            <LoadingSpinner size="lg" className="text-white" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">Loading workspace</h3>
                    <p className="text-slate-500">Setting up your task environment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Modern Header with Glassmorphism */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 shadow-xl shadow-slate-900/5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                        Task Management
                                    </h1>
                                    <p className="text-slate-600 font-medium">
                                        Streamline your workflow • Boost productivity
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium text-slate-600">
                                        {pagination.totalTasks} active tasks
                                    </span>
                                </div>
                                <div className="hidden sm:flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm text-slate-500">
                                        Last updated {new Date().toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 mt-6 lg:mt-0">
                            {/* View Mode Toggle */}
                            <div className="flex items-center bg-slate-100 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all duration-200 ${
                                        viewMode === 'grid' 
                                            ? 'bg-white shadow-sm text-slate-700' 
                                            : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all duration-200 ${
                                        viewMode === 'list' 
                                            ? 'bg-white shadow-sm text-slate-700' 
                                            : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>

                            <Link 
                                to="/tasks/new" 
                                className="group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <svg className="w-5 h-5 mr-2 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="relative z-10">Create Task</span>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Enhanced Filters with Modern Design */}
                <div className="mb-8">
                    <TaskFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={clearFilters}
                        totalTasks={pagination.totalTasks}
                    />
                </div>

                {/* Error State with Modern Design */}
                {error && (
                    <div className="bg-red-50/80 backdrop-blur-xl border border-red-200/50 rounded-2xl p-8 text-center mb-8 shadow-lg">
                        <div className="w-16 h-16 bg-red-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-red-800 mb-2">Something went wrong</h3>
                        <p className="text-red-600 mb-6">{error}</p>
                        <button
                            onClick={fetchTasks}
                            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Try Again
                        </button>
                    </div>
                )}

                {/* Tasks Content */}
                {!error && (
                    <>
                        {tasks.length === 0 ? (
                            <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center shadow-xl shadow-slate-900/5">
                                <div className="max-w-md mx-auto">
                                    <div className="relative mb-8">
                                        <div className="w-24 h-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded-3xl mx-auto flex items-center justify-center">
                                            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-300 rounded-3xl blur-2xl opacity-20"></div>
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold text-slate-800 mb-4">
                                        {filters.search || filters.status || filters.priority
                                            ? 'No matches found'
                                            : 'Ready to get started?'
                                        }
                                    </h3>
                                    <p className="text-slate-600 mb-8 leading-relaxed">
                                        {filters.search || filters.status || filters.priority
                                            ? 'Try adjusting your search criteria or filters to discover more tasks.'
                                            : 'Create your first task and begin organizing your workflow with our powerful task management system.'
                                        }
                                    </p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        {filters.search || filters.status || filters.priority ? (
                                            <button
                                                onClick={clearFilters}
                                                className="inline-flex items-center justify-center px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors duration-200"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Clear Filters
                                            </button>
                                        ) : null}
                                        <Link 
                                            to="/tasks/new" 
                                            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Create Your First Task
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Tasks Grid with Modern Design */}
                                <div className={`mb-8 ${
                                    viewMode === 'grid' 
                                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                                        : 'space-y-4'
                                }`}>
                                    {tasks.map((task, index) => (
                                        <div 
                                            key={task._id}
                                            className="animate-in slide-in-from-bottom-4 duration-300"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <TaskCard
                                                task={task}
                                                onUpdate={handleTaskUpdate}
                                                onDelete={handleTaskDelete}
                                                viewMode={viewMode}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Loading indicator for pagination */}
                                {loading && (
                                    <div className="flex justify-center py-8">
                                        <div className="flex items-center space-x-3">
                                            <LoadingSpinner size="md" />
                                            <span className="text-slate-600 font-medium">Loading more tasks...</span>
                                        </div>
                                    </div>
                                )}

                                {/* Modern Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg">
                                        <div className="flex flex-col sm:flex-row items-center justify-between">
                                            <div className="text-sm text-slate-600 mb-4 sm:mb-0 font-medium">
                                                Page {pagination.page} of {pagination.totalPages} • {pagination.totalTasks} total tasks
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handlePageChange(pagination.page - 1)}
                                                    disabled={!pagination.hasPrev}
                                                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-white/80 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                    Previous
                                                </button>

                                                {/* Page numbers with modern design */}
                                                <div className="flex items-center space-x-1">
                                                    {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                                                        const pageNum = i + 1;
                                                        const isCurrentPage = pageNum === pagination.page;

                                                        return (
                                                            <button
                                                                key={pageNum}
                                                                onClick={() => handlePageChange(pageNum)}
                                                                className={`w-10 h-10 text-sm font-semibold rounded-lg transition-all duration-200 ${
                                                                    isCurrentPage
                                                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                                                        : 'text-slate-600 bg-white/80 border border-slate-200 hover:bg-slate-50'
                                                                }`}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                <button
                                                    onClick={() => handlePageChange(pagination.page + 1)}
                                                    disabled={!pagination.hasNext}
                                                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-white/80 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                                >
                                                    Next
                                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TasksPage;