import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { tasksAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CreateTaskPage = () => {
    const { user } = useContext(AuthContext);
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
        { value: 'low', label: 'Low', color: 'text-green-600' },
        { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
        { value: 'high', label: 'High', color: 'text-orange-600' },
        { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
    ];

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' }
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center space-x-4 mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Create New Task</h1>
                        <p className="text-gray-600">Add a new task to your workflow</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="label">
                            Task Title *
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            className={`input ${errors.title ? 'border-red-500' : ''}`}
                            placeholder="Enter task title"
                            maxLength={100}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                            {formData.title.length}/100 characters
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="label">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            className={`input resize-none ${errors.description ? 'border-red-500' : ''}`}
                            placeholder="Describe your task in detail..."
                            maxLength={1000}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                            {formData.description.length}/1000 characters
                        </p>
                    </div>

                    {/* Priority and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="priority" className="label">
                                Priority
                            </label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="input"
                            >
                                {priorityOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="status" className="label">
                                Initial Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="input"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label htmlFor="dueDate" className="label">
                            Due Date
                        </label>
                        <input
                            id="dueDate"
                            name="dueDate"
                            type="date"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className={`input ${errors.dueDate ? 'border-red-500' : ''}`}
                            min={new Date().toISOString().split('T')[0]}
                        />
                        {errors.dueDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                        )}
                    </div>

                    {/* Tags */}
                    <div>
                        <label htmlFor="tags" className="label">
                            Tags
                        </label>
                        <input
                            id="tags"
                            name="tags"
                            type="text"
                            value={formData.tags}
                            onChange={handleChange}
                            className="input"
                            placeholder="Enter tags separated by commas (e.g., work, urgent, project)"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Separate multiple tags with commas
                        </p>
                    </div>

                    {/* Preview */}
                    {formData.tags && (
                        <div>
                            <label className="label">Tag Preview</label>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.split(',').map((tag, index) => {
                                    const trimmedTag = tag.trim();
                                    if (!trimmedTag) return null;
                                    return (
                                        <span
                                            key={index}
                                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                                        >
                                            #{trimmedTag}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.title.trim()}
                            className="btn-primary"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <LoadingSpinner size="sm" />
                                    <span className="ml-2">Creating...</span>
                                </div>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Create Task
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskPage; 