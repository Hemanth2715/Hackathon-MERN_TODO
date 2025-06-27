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
            pending: 'bg-amber-50 text-amber-700 border-amber-200',
            'in-progress': 'bg-blue-50 text-blue-700 border-blue-200',
            completed: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
        return colors[status] || 'bg-slate-50 text-slate-700 border-slate-200';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            medium: 'bg-amber-50 text-amber-700 border-amber-200',
            high: 'bg-orange-50 text-orange-700 border-orange-200',
            urgent: 'bg-red-50 text-red-700 border-red-200'
        };
        return colors[priority] || 'bg-slate-50 text-slate-700 border-slate-200';
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

    const getStatusIcon = (status) => {
        const icons = {
            pending: (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            'in-progress': (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            completed: (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        };
        return icons[status];
    };

    const getPriorityIcon = (priority) => {
        const icons = {
            low: (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            ),
            medium: (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            high: (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            ),
            urgent: (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            )
        };
        return icons[priority];
    };

    return (
        <div className="group relative bg-white border border-slate-200/60 rounded-2xl p-6 hover:border-slate-300/60 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 backdrop-blur-sm overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Priority Indicator */}
            <div className={`absolute top-0 left-0 w-1 h-full ${
                task.priority === 'urgent' ? 'bg-red-500' :
                task.priority === 'high' ? 'bg-orange-500' :
                task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
            }`} />

            {/* Card Header */}
            <div className="relative flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <Link
                        to={`/tasks/${task._id}`}
                        className="group/title block"
                    >
                        <h3 className="text-lg font-semibold text-slate-900 group-hover/title:text-blue-700 transition-colors duration-200 line-clamp-2 leading-tight">
                            {task.title}
                        </h3>
                    </Link>
                    {task.description && (
                        <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
                            {task.description}
                        </p>
                    )}
                </div>

                {/* Actions Menu */}
                <div className="relative ml-4 flex-shrink-0">
                    <button
                        onClick={() => setShowActions(!showActions)}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100/70 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        disabled={loading}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>

                    {/* Enhanced Actions Dropdown */}
                    {showActions && (
                        <div className="absolute right-0 top-12 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 py-2 z-20 animate-in slide-in-from-top-2 duration-200">
                            <div className="px-3 py-2 border-b border-slate-100">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Quick Actions</p>
                            </div>
                            
                            <button
                                onClick={() => handleStatusChange(getNextStatus())}
                                className="w-full flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                                disabled={loading}
                            >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {getNextStatusLabel()} Task
                            </button>
                            
                            <Link
                                to={`/tasks/${task._id}/edit`}
                                className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-all duration-200"
                                onClick={() => setShowActions(false)}
                            >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Task
                            </Link>
                            
                            <Link
                                to={`/tasks/${task._id}/share`}
                                className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200"
                                onClick={() => setShowActions(false)}
                            >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                </svg>
                                Share Task
                            </Link>
                            
                            <div className="border-t border-slate-100 mt-1 pt-1">
                                <button
                                    onClick={handleDelete}
                                    className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                                    disabled={loading}
                                >
                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete Task
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Status and Priority Badges */}
            <div className="flex items-center gap-2 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-full ${getStatusColor(task.status)}`}>
                    {getStatusIcon(task.status)}
                    {task.status.replace('-', ' ')}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-full ${getPriorityColor(task.priority)}`}>
                    {getPriorityIcon(task.priority)}
                    {task.priority}
                </span>
                {task.sharedWith && task.sharedWith.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200 rounded-full">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Shared
                    </span>
                )}
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {task.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-slate-100/70 text-slate-600 rounded-lg hover:bg-slate-200/70 transition-colors duration-200">
                            #{tag}
                        </span>
                    ))}
                    {task.tags.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-slate-100/70 text-slate-600 rounded-lg">
                            +{task.tags.length - 3} more
                        </span>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100/60">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Updated {formatDate(task.updatedAt)}
                    </div>
                    {task.dueDate && (
                        <div className={`flex items-center gap-1 ${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : ''}`}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Due {formatDate(task.dueDate)}
                        </div>
                    )}
                </div>

                {/* Status Indicator */}
                {task.status === 'completed' && (
                    <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs font-medium">Completed</span>
                    </div>
                )}
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                    </div>
                </div>
            )}

            {/* Click Outside Overlay */}
            {showActions && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowActions(false)}
                />
            )}
        </div>
    );
};

export default TaskCard;