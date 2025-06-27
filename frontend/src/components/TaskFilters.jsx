import { useState } from 'react';

const TaskFilters = ({ filters, onFilterChange, onClearFilters, totalTasks }) => {
    const [showFilters, setShowFilters] = useState(false);

    const handleSearchChange = (e) => {
        onFilterChange({ search: e.target.value });
    };

    const handleFilterChange = (key, value) => {
        onFilterChange({ [key]: value });
    };

    const hasActiveFilters = filters.status || filters.priority || filters.search;

    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' }
    ];

    const priorityOptions = [
        { value: '', label: 'All Priorities' },
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
    ];

    const sortOptions = [
        { value: 'createdAt', label: 'Date Created' },
        { value: 'updatedAt', label: 'Last Updated' },
        { value: 'dueDate', label: 'Due Date' },
        { value: 'priority', label: 'Priority' },
        { value: 'title', label: 'Title' }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    <h2 className="text-lg font-medium text-gray-900">
                        {totalTasks} Task{totalTasks !== 1 ? 's' : ''}
                    </h2>
                    {hasActiveFilters && (
                        <button
                            onClick={onClearFilters}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="btn-text sm:hidden"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters
                </button>
            </div>

            {/* Search Bar - Always visible */}
            <div className="mb-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={filters.search}
                        onChange={handleSearchChange}
                        className="input pl-10"
                    />
                    {filters.search && (
                        <button
                            onClick={() => handleFilterChange('search', '')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Filters - Hidden on mobile by default */}
            <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Status Filter */}
                    <div>
                        <label htmlFor="status" className="label">
                            Status
                        </label>
                        <select
                            id="status"
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="input"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Priority Filter */}
                    <div>
                        <label htmlFor="priority" className="label">
                            Priority
                        </label>
                        <select
                            id="priority"
                            value={filters.priority}
                            onChange={(e) => handleFilterChange('priority', e.target.value)}
                            className="input"
                        >
                            {priorityOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort By */}
                    <div>
                        <label htmlFor="sortBy" className="label">
                            Sort by
                        </label>
                        <select
                            id="sortBy"
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            className="input"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Order */}
                    <div>
                        <label htmlFor="sortOrder" className="label">
                            Order
                        </label>
                        <select
                            id="sortOrder"
                            value={filters.sortOrder}
                            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                            className="input"
                        >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </select>
                    </div>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-gray-600">Active filters:</span>

                            {filters.search && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                    Search: "{filters.search}"
                                    <button
                                        onClick={() => handleFilterChange('search', '')}
                                        className="ml-2 hover:text-primary-600"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            )}

                            {filters.status && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Status: {statusOptions.find(s => s.value === filters.status)?.label}
                                    <button
                                        onClick={() => handleFilterChange('status', '')}
                                        className="ml-2 hover:text-blue-600"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            )}

                            {filters.priority && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                    Priority: {priorityOptions.find(p => p.value === filters.priority)?.label}
                                    <button
                                        onClick={() => handleFilterChange('priority', '')}
                                        className="ml-2 hover:text-orange-600"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskFilters; 