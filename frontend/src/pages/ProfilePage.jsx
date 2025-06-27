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
        {
            id: 'profile',
            label: 'Profile',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            id: 'security',
            label: 'Security',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )
        },
        {
            id: 'account',
            label: 'Account',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Manage your profile, security, and account preferences
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <nav className="space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === tab.id
                                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab.icon}
                                    <span className="ml-3">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="p-6 lg:p-8">
                                    <div className="border-b border-gray-200 pb-6 mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Update your account&apos;s profile information and email address.
                                        </p>
                                    </div>

                                    <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-lg">
                                        <div className="grid grid-cols-1 gap-6">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Full Name
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        value={profileData.name}
                                                        onChange={handleProfileChange}
                                                        className={`appearance-none block w-full px-4 py-3 border ${errors.name ? 'border-red-300' : 'border-gray-300'
                                                            } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                                        placeholder="Enter your full name"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {errors.name && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email Address
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        value={profileData.email}
                                                        onChange={handleProfileChange}
                                                        className={`appearance-none block w-full px-4 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'
                                                            } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                                        placeholder="Enter your email"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {errors.email && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Account Type
                                                </label>
                                                <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0">
                                                            {user?.provider === 'google' ? (
                                                                <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24">
                                                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <span className="ml-3 text-sm font-medium text-gray-700">
                                                            {user?.provider === 'google' ? 'Google Account' : 'Email Account'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-gray-200">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="group relative flex justify-center py-3 px-6 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                                            >
                                                {loading ? (
                                                    <>
                                                        <LoadingSpinner size="sm" className="mr-2" />
                                                        Updating...
                                                    </>
                                                ) : (
                                                    <>
                                                        Save Changes
                                                        <svg className="ml-2 -mr-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="p-6 lg:p-8">
                                    <div className="border-b border-gray-200 pb-6 mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-900">Security Settings</h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Manage your account security and password settings.
                                        </p>
                                    </div>

                                    {user?.provider === 'google' ? (
                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-blue-800">Google Account Security</h3>
                                                    <div className="mt-2 text-sm text-blue-700">
                                                        <p>
                                                            Your account is secured through Google. To change your password or manage two-factor authentication, please visit your Google Account settings.
                                                        </p>
                                                    </div>
                                                    <div className="mt-4">
                                                        <a
                                                            href="https://myaccount.google.com/security"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                                                        >
                                                            Manage Google Security
                                                            <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-lg">
                                            <div>
                                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Current Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        id="currentPassword"
                                                        name="currentPassword"
                                                        type="password"
                                                        value={passwordData.currentPassword}
                                                        onChange={handlePasswordChange}
                                                        className={`appearance-none block w-full px-4 py-3 border ${errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                                                            } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                                        placeholder="Enter current password"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {errors.currentPassword && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                                    New Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        id="newPassword"
                                                        name="newPassword"
                                                        type="password"
                                                        value={passwordData.newPassword}
                                                        onChange={handlePasswordChange}
                                                        className={`appearance-none block w-full px-4 py-3 border ${errors.newPassword ? 'border-red-300' : 'border-gray-300'
                                                            } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                                        placeholder="Enter new password"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {errors.newPassword && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Confirm New Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        type="password"
                                                        value={passwordData.confirmPassword}
                                                        onChange={handlePasswordChange}
                                                        className={`appearance-none block w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                                            } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                                        placeholder="Confirm new password"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {errors.confirmPassword && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                                )}
                                            </div>

                                            <div className="pt-6 border-t border-gray-200">
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="group relative flex justify-center py-3 px-6 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <LoadingSpinner size="sm" className="mr-2" />
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Update Password
                                                            <svg className="ml-2 -mr-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            )}

                            {/* Account Tab */}
                            {activeTab === 'account' && (
                                <div className="p-6 lg:p-8">
                                    <div className="border-b border-gray-200 pb-6 mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-900">Account Management</h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            View your account information and manage account preferences.
                                        </p>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Account Information */}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500">Member since</dt>
                                                        <dd className="mt-1 text-sm text-gray-900">
                                                            {new Date(user?.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500">Account Type</dt>
                                                        <dd className="mt-1 text-sm text-gray-900">
                                                            {user?.provider === 'google' ? 'Google Account' : 'Email Account'}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                                                        <dd className="mt-1">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                <span className="w-1.5 h-1.5 mr-1.5 bg-green-400 rounded-full"></span>
                                                                Active
                                                            </span>
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500">User ID</dt>
                                                        <dd className="mt-1 text-sm text-gray-900 font-mono">
                                                            {user?._id?.slice(-8) || 'N/A'}
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </div>
                                        </div>

                                        {/* Danger Zone */}
                                        <div className="border-t border-gray-200 pt-8">
                                            <h3 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
                                            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3 flex-1">
                                                        <h4 className="text-sm font-medium text-red-800">Delete Account</h4>
                                                        <div className="mt-2 text-sm text-red-700">
                                                            <p>
                                                                Permanently delete your account and all associated data. This action cannot be undone.
                                                            </p>
                                                        </div>
                                                        <div className="mt-4">
                                                            <button
                                                                onClick={handleDeleteAccount}
                                                                disabled={loading}
                                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                            >
                                                                {loading ? (
                                                                    <>
                                                                        <LoadingSpinner size="sm" className="mr-2" />
                                                                        Deleting...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                        </svg>
                                                                        Delete Account
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage; 