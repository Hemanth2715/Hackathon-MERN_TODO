import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/tasks', label: 'Tasks' },
        { path: '/profile', label: 'Profile' },
    ];

    const isActivePath = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-default shadow-sm">
            <div className="container-custom">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-primary-950">TaskFlow</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navItems.map(({ path, label }) => (
                            <Link
                                key={path}
                                to={path}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActivePath(path)
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'
                                    }`}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <span className="text-sm font-medium text-gray-700">
                                {user?.name}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary-700 hover:bg-primary-50"
                    >
                        ☰
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-default py-4">
                        <div className="space-y-2">
                            {navItems.map(({ path, label }) => (
                                <Link
                                    key={path}
                                    to={path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActivePath(path)
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'
                                        }`}
                                >
                                    {label}
                                </Link>
                            ))}

                            <div className="pt-4 mt-4 border-t border-default">
                                <div className="flex items-center space-x-3 px-3 py-2">
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-gray-700">
                                        {user?.name}
                                    </span>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-2 mt-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
