/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authAPI, apiUtils } from '../services/api';
import { signInWithGoogle, signOutUser, auth } from '../config/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import socketService from '../services/socket';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [firebaseUser, setFirebaseUser] = useState(null);

    // Initialize authentication state
    const initializeAuth = useCallback(async () => {
        setIsLoading(true);

        try {
            const token = apiUtils.getAuthToken();
            const storedUser = apiUtils.getStoredUser();

            if (token && storedUser) {
                // Verify token with server
                const response = await authAPI.verifyToken();
                if (response.success) {
                    setUser(response.data.user);
                    setIsAuthenticated(true);
                    apiUtils.storeUser(response.data.user);

                    // Connect to socket for real-time updates
                    socketService.connect(response.data.user._id);
                } else {
                    // Token is invalid, clear auth
                    await logout();
                }
            } else {
                // No token or user data
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Auth initialization error:', error);
            // Clear invalid auth data
            await logout();
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Listen to Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setFirebaseUser(firebaseUser);
        });

        return () => unsubscribe();
    }, []);

    // Login function
    const login = async (credentials) => {
        try {
            setIsLoading(true);
            const response = await authAPI.login(credentials);

            if (response.success) {
                const { user: userData, token } = response.data;

                // Store auth data
                apiUtils.setAuthToken(token);
                apiUtils.storeUser(userData);

                // Update state
                setUser(userData);
                setIsAuthenticated(true);

                // Connect to socket
                socketService.connect(userData._id);

                toast.success('Login successful!');
                return { success: true, user: userData };
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = apiUtils.formatErrorMessage(error);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };

    // Google Login function
    const googleLogin = async () => {
        try {
            setIsLoading(true);
            const result = await signInWithGoogle();

            if (result.success) {
                // Send Firebase token to your backend for verification
                const response = await authAPI.googleAuth(result.token);

                if (response.success) {
                    const { user: userData, token } = response.data;

                    // Store auth data
                    apiUtils.setAuthToken(token);
                    apiUtils.storeUser(userData);

                    // Update state
                    setUser(userData);
                    setIsAuthenticated(true);

                    // Connect to socket
                    socketService.connect(userData._id);

                    toast.success('Google login successful!');
                    return { success: true, user: userData };
                } else {
                    await signOutUser(); // Sign out from Firebase if backend auth fails
                    throw new Error(response.error || 'Backend authentication failed');
                }
            } else {
                throw new Error(result.error || 'Google sign-in failed');
            }
        } catch (error) {
            console.error('Google login error:', error);
            const errorMessage = error.message || 'Google authentication failed';
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            setIsLoading(true);
            const response = await authAPI.register(userData);

            if (response.success) {
                const { user: newUser, token } = response.data;

                // Store auth data
                apiUtils.setAuthToken(token);
                apiUtils.storeUser(newUser);

                // Update state
                setUser(newUser);
                setIsAuthenticated(true);

                // Connect to socket
                socketService.connect(newUser._id);

                toast.success('Registration successful!');
                return { success: true, user: newUser };
            }
        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = apiUtils.formatErrorMessage(error);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            // Attempt to notify server of logout
            if (isAuthenticated) {
                await authAPI.logout();
            }

            // Sign out from Firebase
            if (firebaseUser) {
                await signOutUser();
            }
        } catch (error) {
            // Don't block logout on server error
            console.error('Logout server error:', error);
        } finally {
            // Clear auth data locally
            apiUtils.clearAuth();
            setUser(null);
            setIsAuthenticated(false);
            setFirebaseUser(null);

            // Disconnect socket
            socketService.disconnect();

            toast.success('Logged out successfully');
        }
    };

    // Update user profile
    const updateProfile = async (profileData) => {
        try {
            setIsLoading(true);
            const response = await authAPI.updateProfile(profileData);

            if (response.success) {
                const updatedUser = response.data.user;
                setUser(updatedUser);
                apiUtils.storeUser(updatedUser);
                toast.success('Profile updated successfully!');
                return { success: true, user: updatedUser };
            }
        } catch (error) {
            console.error('Profile update error:', error);
            const errorMessage = apiUtils.formatErrorMessage(error);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Google OAuth success
    const handleGoogleAuthSuccess = async (token) => {
        try {
            setIsLoading(true);

            // Set token and get user data
            apiUtils.setAuthToken(token);
            const response = await authAPI.getProfile();

            if (response.success) {
                const userData = response.data.user;

                // Store user data
                apiUtils.storeUser(userData);

                // Update state
                setUser(userData);
                setIsAuthenticated(true);

                // Connect to socket
                socketService.connect(userData._id);

                toast.success('Google login successful!');
                return { success: true, user: userData };
            }
        } catch (error) {
            console.error('Google auth error:', error);
            await logout();
            return { success: false, error: 'Google authentication failed' };
        } finally {
            setIsLoading(false);
        }
    };

    // Refresh user data
    const refreshUser = async () => {
        try {
            const response = await authAPI.getProfile();
            if (response.success) {
                const userData = response.data.user;
                setUser(userData);
                apiUtils.storeUser(userData);
                return userData;
            }
        } catch (error) {
            console.error('Refresh user error:', error);
            // If refresh fails, logout user
            await logout();
        }
    };

    // Initialize auth on mount
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    // Handle browser tab focus to refresh auth state
    useEffect(() => {
        const handleFocus = () => {
            if (isAuthenticated && !isLoading) {
                refreshUser();
            }
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [isAuthenticated, isLoading]);

    // Auth context value
    const value = {
        user,
        isLoading,
        isAuthenticated,
        firebaseUser,
        login,
        register,
        logout,
        googleLogin,
        updateProfile,
        handleGoogleAuthSuccess,
        refreshUser,
        initializeAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
