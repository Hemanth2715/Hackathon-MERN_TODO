import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CreateTaskPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: '',
        tags: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.trim().length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
        }

        if (formData.description.length > 1000) {
            newErrors.description = 'Description must be less than 1000 characters';
        }

        if (formData.dueDate) {
            const dueDate = new Date(formData.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (dueDate < today) {
                newErrors.dueDate = 'Due date cannot be in the past';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const taskData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                priority: formData.priority,
                status: formData.status,
                dueDate: formData.dueDate || null,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };

            const response = await tasksAPI.createTask(taskData);
            toast.success('Task created successfully');
            navigate(`/tasks/${response.data.task._id}`);
        } catch (error) {
            console.error('Failed to create task:', error);
            toast.error(error.response?.data?.message || 'Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    const priorityOptions = [
        { 
            value: 'low', 
            label: 'Low Priority', 
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            icon: '🟢'
        },
        { 
            value: 'medium', 
            label: 'Medium Priority', 
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            icon: '🟡'
        },
        { 
            value: 'high', 
            label: 'High Priority', 
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            icon: '🟠'
        },
        { 
            value: 'urgent', 
            label: 'Urgent Priority', 
            color: 'text-red-600',
            bg: 'bg-red-50',
            icon: '🔴'
        }
    ];

    const statusOptions = [
        { 
            value: 'pending', 
            label: 'Pending',
            icon: '⏳',
            color: 'text-slate-600'
        },
        { 
            value: 'in-progress', 
            label: 'In Progress',
            icon: '🚀',
            color: 'text-blue-600'
        },
        { 
            value: 'completed', 
            label: 'Completed',
            icon: '✅',
            color: 'text-green-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Top Navigation Bar */}
            <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 group"
                            >
                                <div className="p-2 rounded-full group-hover:bg-slate-100 transition-colors duration-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium">Back to Tasks</span>
                            </button>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-500">
                                <span>Draft saved automatically</span>
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent mb-3">
                        Create New Task
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Transform your ideas into actionable tasks with our intuitive task management system
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden">
                    <div className="p-8 lg:p-12">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Task Title Section */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold text-sm">1</span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-slate-900">Task Information</h2>
                                </div>

                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-3">
                                        Task Title *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="title"
                                            name="title"
                                            type="text"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-4 text-lg border-2 rounded-2xl bg-white/50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
                                                errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                            placeholder="What needs to be accomplished?"
                                            maxLength={100}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                            <span className="text-sm text-slate-400 font-medium">
                                                {formData.title.length}/100
                                            </span>
                                        </div>
                                    </div>
                                    {errors.title && (
                                        <div className="flex items-center space-x-2 mt-2">
                                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-sm text-red-600">{errors.title}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-3">
                                        Description
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={5}
                                            value={formData.description}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-4 border-2 rounded-2xl bg-white/50 resize-none transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
                                                errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                            placeholder="Provide detailed information about the task, including context, requirements, and expected outcomes..."
                                            maxLength={1000}
                                        />
                                        <div className="absolute bottom-0 right-0 p-4">
                                            <span className="text-sm text-slate-400 font-medium">
                                                {formData.description.length}/1000
                                            </span>
                                        </div>
                                    </div>
                                    {errors.description && (
                                        <div className="flex items-center space-x-2 mt-2">
                                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-sm text-red-600">{errors.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Task Configuration Section */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                                        <span className="text-purple-600 font-semibold text-sm">2</span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-slate-900">Configuration</h2>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Priority Selection */}
                                    <div>
                                        <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-3">
                                            Priority Level
                                        </label>
                                        <div className="space-y-2">
                                            {priorityOptions.map((option) => (
                                                <label
                                                    key={option.value}
                                                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                                                        formData.priority === option.value
                                                            ? `border-blue-500 ${option.bg} ring-4 ring-blue-500/20`
                                                            : 'border-slate-200 bg-white/50 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="priority"
                                                        value={option.value}
                                                        checked={formData.priority === option.value}
                                                        onChange={handleChange}
                                                        className="sr-only"
                                                    />
                                                    <span className="text-xl mr-3">{option.icon}</span>
                                                    <div className="flex-1">
                                                        <span className={`font-medium ${option.color}`}>
                                                            {option.label}
                                                        </span>
                                                    </div>
                                                    {formData.priority === option.value && (
                                                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Status Selection */}
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-3">
                                            Initial Status
                                        </label>
                                        <div className="space-y-2">
                                            {statusOptions.map((option) => (
                                                <label
                                                    key={option.value}
                                                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                                                        formData.status === option.value
                                                            ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-500/20'
                                                            : 'border-slate-200 bg-white/50 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        value={option.value}
                                                        checked={formData.status === option.value}
                                                        onChange={handleChange}
                                                        className="sr-only"
                                                    />
                                                    <span className="text-xl mr-3">{option.icon}</span>
                                                    <div className="flex-1">
                                                        <span className={`font-medium ${option.color}`}>
                                                            {option.label}
                                                        </span>
                                                    </div>
                                                    {formData.status === option.value && (
                                                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Details Section */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                                        <span className="text-green-600 font-semibold text-sm">3</span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-slate-900">Additional Details</h2>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Due Date */}
                                    <div>
                                        <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 mb-3">
                                            Due Date
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="dueDate"
                                                name="dueDate"
                                                type="date"
                                                value={formData.dueDate}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-4 border-2 rounded-2xl bg-white/50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
                                                    errors.dueDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        {errors.dueDate && (
                                            <div className="flex items-center space-x-2 mt-2">
                                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                <p className="text-sm text-red-600">{errors.dueDate}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-3">
                                            Tags
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="tags"
                                                name="tags"
                                                type="text"
                                                value={formData.tags}
                                                onChange={handleChange}
                                                className="w-full px-4 py-4 border-2 rounded-2xl bg-white/50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 border-slate-200 hover:border-slate-300"
                                                placeholder="marketing, urgent, project-alpha"
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-500">
                                            Separate tags with commas for better organization
                                        </p>
                                    </div>
                                </div>

                                {/* Tag Preview */}
                                {formData.tags && (
                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-slate-700 mb-3">
                                            Tag Preview
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.tags.split(',').map((tag, index) => {
                                                const trimmedTag = tag.trim();
                                                if (!trimmedTag) return null;
                                                return (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full border border-blue-200/50"
                                                    >
                                                        <span className="mr-1">#</span>
                                                        {trimmedTag}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-8 border-t border-slate-200/60">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    disabled={loading}
                                    className="px-6 py-3 text-slate-700 font-medium border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                
                                <button
                                    type="submit"
                                    disabled={loading || !formData.title.trim()}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? (
                                        <div className="flex items-center space-x-2">
                                            <LoadingSpinner size="sm" />
                                            <span>Creating Task...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            <span>Create Task</span>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer Helper Text */}
                <div className="text-center mt-8">
                    <p className="text-sm text-slate-500">
                        💡 Pro tip: Use descriptive titles and relevant tags to make your tasks easier to find and organize
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskPage;