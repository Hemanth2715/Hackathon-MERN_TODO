import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const from = location.state?.from?.pathname || '/dashboard';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await login(formData);

        if (result.success) {
            navigate(from, { replace: true });
        }
        setIsLoading(false);
    };

    const handleGoogleLogin = () => {
        window.location.href = authAPI.getGoogleAuthURL();
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Hero content */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-brand p-12 flex-col justify-center">
                <div className="max-w-md">
                    <h1 className="heading-xl mb-6">
                        Celebrate the joy of accomplishment
                    </h1>
                    <p className="body-lg text-primary-800 mb-8">
                        Track your progress, motivate your efforts, and celebrate your productivity with TaskFlow.
                    </p>
                    <div className="inline-flex items-center rounded-lg border border-default px-3 py-1 text-sm font-medium bg-white/20 text-primary-950">
                        Version 2.0 is here
                    </div>
                </div>
            </div>

            {/* Right side - Login form */}
            <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="text-center lg:text-left">
                        <h2 className="heading-md mb-2">Welcome back</h2>
                        <p className="body-md text-gray-600">
                            Sign in to your account to continue
                        </p>
                    </div>

                    <div className="mt-8">
                        {/* Google OAuth Button */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full flex justify-center items-center px-4 py-3 border border-default rounded-lg shadow-button hover:shadow-card-hover bg-white text-gray-700 font-medium text-sm transition-all duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue with Google
                        </button>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-default" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>
                        </div>

                        {/* Login Form */}
                        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn btn-primary w-full btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                                    Sign in
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don&apos;t have an account?{' '}
                                <Link to="/register" className="btn-text font-medium">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
