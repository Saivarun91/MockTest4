'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { UserCircleIcon, CreditCardIcon, AcademicCapIcon, ChartBarIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from '@/app/api/axios';

export default function ProfilePage() {
    const { user, logout } = useUser();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        password: '',
        confirmPassword: ''
    });
    const [payments, setPayments] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [testAttempts, setTestAttempts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setEditForm(prev => ({ ...prev, name: user.name || '' }));
            fetchUserData();
        }
    }, [user]);

    const fetchUserData = async () => {
        if (!user) return;
        
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch payments
            const paymentsResponse = await axios.get('/api/payments/', { headers });
            if (paymentsResponse.data.success) {
                setPayments(paymentsResponse.data.payments);
            }
            console.log("payments",paymentsResponse.data);

            // Fetch enrollments
            const enrollmentsResponse = await axios.get('/api/payments/enrollments/', { headers });
            if (enrollmentsResponse.data.success) {
                setEnrollments(enrollmentsResponse.data.enrollments);
            }
            console.log("enrollments",enrollmentsResponse.data);

            // Fetch test attempts
            const testAttemptsResponse = await axios.get('/api/auth/test-attempts/', { headers });
            if (testAttemptsResponse.data.success) {
                setTestAttempts(testAttemptsResponse.data.test_attempts);
            }
            console.log("testAttempts",testAttemptsResponse.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setMessage({ type: 'error', text: 'Failed to fetch user data' });
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async () => {
        if (editForm.password !== editForm.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (editForm.password && editForm.password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            
            const updateData = { name: editForm.name };
            if (editForm.password) {
                updateData.password = editForm.password;
            }

            const response = await axios.put('/api/auth/profile/', updateData, { headers });
            
            if (response.data.message) {
                setMessage({ type: 'success', text: response.data.message });
                setIsEditing(false);
                setEditForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
                
                // Update local storage with new user data
                const updatedUser = { ...user, name: editForm.name };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                window.location.reload(); // Refresh to update context
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount, currency = 'INR') => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'failed': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const tabs = [
        { id: 'profile', name: 'Profile', icon: UserCircleIcon },
        { id: 'payments', name: 'Payments', icon: CreditCardIcon },
        { id: 'enrollments', name: 'Courses', icon: AcademicCapIcon },
        { id: 'attempts', name: 'Test Attempts', icon: ChartBarIcon }
    ];

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Please log in to view your profile</p>
                    <button
                        onClick={() => window.location.href = '/auth/login'}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{user.name || 'User'}</h1>
                            <p className="text-gray-600">{user.email}</p>
                            <p className="text-sm text-gray-500 capitalize">Role: {user.role}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <tab.icon className="h-5 w-5" />
                                    <span>{tab.name}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Message Display */}
                        {message.text && (
                            <div className={`mb-4 p-4 rounded-md ${
                                message.type === 'success' 
                                    ? 'bg-green-50 text-green-800 border border-green-200' 
                                    : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                                {message.text}
                            </div>
                        )}

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                            <span>Edit</span>
                                        </button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                New Password (leave blank to keep current)
                                            </label>
                                            <input
                                                type="password"
                                                value={editForm.password}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={editForm.confirmPassword}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={handleProfileUpdate}
                                                disabled={loading}
                                                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                <CheckIcon className="h-4 w-4" />
                                                <span>{loading ? 'Updating...' : 'Save Changes'}</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setEditForm({ name: user.name || '', password: '', confirmPassword: '' });
                                                    setMessage({ type: '', text: '' });
                                                }}
                                                className="flex items-center space-x-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                                            >
                                                <XMarkIcon className="h-4 w-4" />
                                                <span>Cancel</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <p className="mt-1 text-sm text-gray-900">{user.name || 'Not set'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Role</label>
                                            <p className="mt-1 text-sm text-gray-900 capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Payments Tab */}
                        {activeTab === 'payments' && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment History</h3>
                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="mt-2 text-gray-600">Loading payments...</p>
                                    </div>
                                ) : payments.length > 0 ? (
                                    <div className="space-y-4">
                                        {payments.map((payment) => (
                                            <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{payment.course_title}</h4>
                                                        <p className="text-sm text-gray-600">Order ID: {payment.razorpay_order_id}</p>
                                                        <p className="text-sm text-gray-600">{formatDate(payment.created_at)}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-semibold text-gray-900">
                                                            {formatCurrency(payment.amount, payment.currency)}
                                                        </p>
                                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                                                            {payment.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <CreditCardIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                        <p>No payment history found</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Enrollments Tab */}
                        {activeTab === 'enrollments' && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Enrolled Courses</h3>
                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="mt-2 text-gray-600">Loading enrollments...</p>
                                    </div>
                                ) : enrollments.length > 0 ? (
                                    <div className="space-y-4">
                                        {enrollments.map((enrollment) => (
                                            <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{enrollment.course_title}</h4>
                                                        <p className="text-sm text-gray-600">Enrolled: {formatDate(enrollment.enrolled_at)}</p>
                                                        {enrollment.expires_at && (
                                                            <p className="text-sm text-gray-600">Expires: {formatDate(enrollment.expires_at)}</p>
                                                        )}
                                                        <div className="mt-2">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-sm text-gray-600">Progress:</span>
                                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                                    <div 
                                                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                                        style={{ width: `${enrollment.progress_percentage}%` }}
                                                                    ></div>
                                                                </div>
                                                                <span className="text-sm text-gray-600">{enrollment.progress_percentage}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-semibold text-gray-900">
                                                            {formatCurrency(enrollment.payment_amount)}
                                                        </p>
                                                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                            Active
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <AcademicCapIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                        <p>No enrolled courses found</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Test Attempts Tab */}
                        {activeTab === 'attempts' && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Test Attempts</h3>
                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="mt-2 text-gray-600">Loading test attempts...</p>
                                    </div>
                                ) : testAttempts.length > 0 ? (
                                    <div className="space-y-4">
                                        {testAttempts.map((attempt) => (
                                            <div key={attempt.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{attempt.course_title}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            {formatDate(attempt.start_time)} - {attempt.end_time ? formatDate(attempt.end_time) : 'In Progress'}
                                                        </p>
                                                        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <span className="text-gray-600">Score:</span>
                                                                <span className="ml-2 font-medium">{attempt.score}/{attempt.total_marks}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-600">Percentage:</span>
                                                                <span className="ml-2 font-medium">{attempt.percentage.toFixed(1)}%</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-600">Duration:</span>
                                                                <span className="ml-2 font-medium">
                                                                    {attempt.duration_taken || 0}/{attempt.time_limit} min
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-600">Status:</span>
                                                                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                                    attempt.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {attempt.passed ? 'Passed' : 'Failed'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <ChartBarIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                        <p>No test attempts found</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
