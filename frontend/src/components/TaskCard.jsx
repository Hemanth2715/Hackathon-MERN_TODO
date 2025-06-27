/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';

const TaskCard = ({ task, onUpdate, onDelete }) => {
    const [loading, setLoading] = useState(false);
    const [showActions, setShowActions] = useState(false);

    const getStatusColor = (status) => {
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
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const isOverdue = (dueDate) => {
        if (!dueDate) return false;
        return new Date(dueDate) < new Date();
    };

    const handleStatusChange = async (newStatus) => {
        if (task.status === newStatus) return;

        setLoading(true);
        try {
            const response = await tasksAPI.updateTask(task._id, { status: newStatus });
            onUpdate(response.data.task);
            toast.success(`Task marked as ${newStatus.replace('-', ' ')}`);
        } catch (error) {
            console.error('Failed to update task status:', error);
            toast.error('Failed to update task status');
        } finally {
            setLoading(false);
            setShowActions(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }

        setLoading(true);
        try {
            await tasksAPI.deleteTask(task._id);
            onDelete(task._id);
            toast.success('Task deleted successfully');
        } catch (error) {
            console.error('Failed to delete task:', error);
            toast.error('Failed to delete task');
        } finally {
            setLoading(false);
        }
    };

    const getNextStatus = () => {
        const statusFlow = {
            pending: 'in-progress',
            'in-progress': 'completed',
            completed: 'pending'
        };
        return statusFlow[task.status];
    };

    const getNextStatusLabel = () => {
        const labels = {
            'in-progress': 'Start',
            completed: 'Complete',
            pending: 'Reset'
        };
        return labels[getNextStatus()];
    };

    return (
        <div className="card group hover:shadow-lg transition-all duration-200">
            {/* Card Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <Link
                        to={`/tasks/${task._id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-200 line-clamp-2"
                    >
                        {task.title}
                    </Link>
                </div>

                <div className="relative ml-2">
                    <button
                        onClick={() => setShowActions(!showActions)}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                        disabled={loading}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>

                    {/* Actions Dropdown */}
                    {showActions && (
                        <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            <button
                                onClick={() => handleStatusChange(getNextStatus())}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                disabled={loading}
                            >
                                {getNextStatusLabel()} Task
                            </button>
                            <Link
                                to={`/tasks/${task._id}/edit`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                onClick={() => setShowActions(false)}
                            >
                                Edit Task
                            </Link>
                            <Link
                                to={`/tasks/${task._id}/share`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                onClick={() => setShowActions(false)}
                            >
                                Share Task
                            </Link>
                            <hr className="my-1" />
                            <button
                                onClick={handleDelete}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                disabled={loading}
                            >
                                Delete Task
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            {task.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {task.description}
                </p>
            )}

            {/* Status and Priority Badges */}
            <div className="flex items-center gap-2 mb-4">
                <span className={`badge ${getStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ')}
                </span>
                <span className={`badge ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                </span>
                {task.sharedWith && task.sharedWith.length > 0 && (
                    <span className="badge bg-purple-100 text-purple-800">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Shared
                    </span>
                )}
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                    {task.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            #{tag}
                        </span>
                    ))}
                    {task.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            +{task.tags.length - 3} more
                        </span>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-3">
                    <span>Updated {formatDate(task.updatedAt)}</span>
                    {task.dueDate && (
                        <span className={`${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : ''}`}>
                            Due {formatDate(task.dueDate)}
                        </span>
                    )}
                </div>

                {/* Progress Indicator for completed tasks */}
                {task.status === 'completed' && (
                    <div className="flex items-center text-green-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs font-medium">Completed</span>
                    </div>
                )}
            </div>

            {/* Loading overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Click outside to close actions */}
            {showActions && (
                <div
                    className="fixed inset-0 z-5"
                    onClick={() => setShowActions(false)}
                />
            )}
        </div>
    );
};

export default TaskCard; 