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
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
                    <p className="text-gray-600">
                        Manage and organize your tasks efficiently
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Link to="/tasks/new" className="btn-primary">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create Task
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <TaskFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                totalTasks={pagination.totalTasks}
            />

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
                    <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchTasks}
                        className="btn-primary"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Tasks List */}
            {!error && (
                <>
                    {tasks.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                                {filters.search || filters.status || filters.priority
                                    ? 'No tasks found'
                                    : 'No tasks yet'
                                }
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {filters.search || filters.status || filters.priority
                                    ? 'Try adjusting your filters to find what you\'re looking for.'
                                    : 'Get started by creating your first task.'
                                }
                            </p>
                            {filters.search || filters.status || filters.priority ? (
                                <button
                                    onClick={clearFilters}
                                    className="btn-secondary mr-3"
                                >
                                    Clear Filters
                                </button>
                            ) : null}
                            <Link to="/tasks/new" className="btn-primary">
                                Create Task
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Tasks Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {tasks.map((task) => (
                                    <TaskCard
                                        key={task._id}
                                        task={task}
                                        onUpdate={handleTaskUpdate}
                                        onDelete={handleTaskDelete}
                                    />
                                ))}
                            </div>

                            {/* Loading indicator for pagination */}
                            {loading && (
                                <div className="flex justify-center py-4">
                                    <LoadingSpinner size="md" />
                                </div>
                            )}

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                                        Showing page {pagination.page} of {pagination.totalPages}
                                        ({pagination.totalTasks} total tasks)
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            disabled={!pagination.hasPrev}
                                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>

                                        {/* Page numbers */}
                                        <div className="flex items-center space-x-1">
                                            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                                                const pageNum = i + 1;
                                                const isCurrentPage = pageNum === pagination.page;

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`px-3 py-2 text-sm font-medium rounded-md ${isCurrentPage
                                                            ? 'bg-primary-600 text-white'
                                                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
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
                                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default TasksPage; 