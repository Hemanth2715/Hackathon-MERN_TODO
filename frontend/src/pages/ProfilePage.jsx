import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { user, updateUser, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
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

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
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

    const validateProfileForm = () => {
        const newErrors = {};

        if (!profileData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (profileData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!profileData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
            newErrors.email = 'Email is invalid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePasswordForm = () => {
        const newErrors = {};

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        if (!validateProfileForm()) return;

        setLoading(true);

        try {
            const response = await authAPI.updateProfile({
                name: profileData.name.trim(),
                email: profileData.email.trim()
            });

            updateUser(response.data.user);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Profile update failed:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (!validatePasswordForm()) return;

        setLoading(true);

        try {
            await authAPI.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            toast.success('Password changed successfully');
        } catch (error) {
            console.error('Password change failed:', error);
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        setLoading(true);

        try {
            await authAPI.deleteAccount();
            toast.success('Account deleted successfully');
            logout();
        } catch (error) {
            console.error('Account deletion failed:', error);
            toast.error(error.response?.data?.message || 'Failed to delete account');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'security', label: 'Security', icon: '🔒' },
        { id: 'account', label: 'Account', icon: '⚙️' }
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
                <p className="text-gray-600">
                    Manage your account settings and preferences
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>

                            <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-md">
                                <div>
                                    <label htmlFor="name" className="label">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={profileData.name}
                                        onChange={handleProfileChange}
                                        className={`input ${errors.name ? 'border-red-500' : ''}`}
                                        placeholder="Enter your full name"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="email" className="label">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={handleProfileChange}
                                        className={`input ${errors.email ? 'border-red-500' : ''}`}
                                        placeholder="Enter your email"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="label">Account Type</label>
                                    <div className="bg-gray-50 px-3 py-2 rounded-lg">
                                        <span className="text-sm text-gray-600">
                                            {user?.provider === 'google' ? 'Google Account' : 'Local Account'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <LoadingSpinner size="sm" />
                                            <span className="ml-2">Updating...</span>
                                        </div>
                                    ) : (
                                        'Update Profile'
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>

                            {user?.provider === 'google' ? (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <h3 className="font-medium text-blue-900 mb-2">Google Account</h3>
                                    <p className="text-blue-700 text-sm">
                                        Your account is managed through Google. Password changes should be made in your Google account settings.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                                    <div>
                                        <label htmlFor="currentPassword" className="label">
                                            Current Password
                                        </label>
                                        <input
                                            id="currentPassword"
                                            name="currentPassword"
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className={`input ${errors.currentPassword ? 'border-red-500' : ''}`}
                                            placeholder="Enter current password"
                                        />
                                        {errors.currentPassword && (
                                            <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="newPassword" className="label">
                                            New Password
                                        </label>
                                        <input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className={`input ${errors.newPassword ? 'border-red-500' : ''}`}
                                            placeholder="Enter new password"
                                        />
                                        {errors.newPassword && (
                                            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="label">
                                            Confirm New Password
                                        </label>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className={`input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                            placeholder="Confirm new password"
                                        />
                                        {errors.confirmPassword && (
                                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary"
                                    >
                                        {loading ? (
                                            <div className="flex items-center">
                                                <LoadingSpinner size="sm" />
                                                <span className="ml-2">Changing...</span>
                                            </div>
                                        ) : (
                                            'Change Password'
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Account Tab */}
                    {activeTab === 'account' && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Management</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Account Information</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-600">Member since:</span>
                                            <span className="text-sm text-gray-900">
                                                {new Date(user?.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-600">Account Type:</span>
                                            <span className="text-sm text-gray-900">
                                                {user?.provider === 'google' ? 'Google Account' : 'Local Account'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-600">Status:</span>
                                            <span className="text-sm text-green-600 font-medium">Active</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-medium text-red-900 mb-2">Danger Zone</h3>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
                                        <p className="text-red-700 text-sm mb-4">
                                            Once you delete your account, there is no going back. All your tasks and data will be permanently deleted.
                                        </p>
                                        <button
                                            onClick={handleDeleteAccount}
                                            disabled={loading}
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <div className="flex items-center">
                                                    <LoadingSpinner size="sm" />
                                                    <span className="ml-2">Deleting...</span>
                                                </div>
                                            ) : (
                                                'Delete Account'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage; 