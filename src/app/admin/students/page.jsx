'use client';
import { useState, useEffect } from 'react';
import { FiRefreshCw, FiCheckCircle, FiXCircle, FiClock, FiUser, FiMail, FiBook } from 'react-icons/fi';

export default function EnrollmentsManagement() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshLoading, setRefreshLoading] = useState(false);

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            setError(null);
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/admin/enrollments/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch enrollments');
            }

            const data = await res.json();
            if (data.success) {
                setEnrollments(data.enrollments);
            } else {
                throw new Error(data.message || 'Failed to load enrollment data');
            }
        } catch (error) {
            console.error('Error fetching enrollments:', error);
            setError(error.message);
        } finally {
            setLoading(false);
            setRefreshLoading(false);
        }
    };

    const handleRefresh = () => {
        setRefreshLoading(true);
        fetchEnrollments();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-gray-600">Loading enrollments...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4 p-6">
                <div className="bg-red-100 p-4 rounded-full">
                    <FiXCircle className="text-red-500 text-3xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Error Loading Enrollments</h2>
                <p className="text-gray-600 text-center max-w-md">{error}</p>
                <button
                    onClick={handleRefresh}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center"
                >
                    {refreshLoading ? (
                        <FiRefreshCw className="animate-spin mr-2" />
                    ) : (
                        <FiRefreshCw className="mr-2" />
                    )}
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Enrollments Management</h1>
                <button
                    onClick={handleRefresh}
                    disabled={refreshLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center text-sm"
                >
                    {refreshLoading ? (
                        <FiRefreshCw className="animate-spin mr-2" />
                    ) : (
                        <FiRefreshCw className="mr-2" />
                    )}
                    Refresh
                </button>
            </div>

            {enrollments.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <FiBook className="mx-auto text-4xl text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No enrollments found</h3>
                    <p className="mt-2 text-gray-500">There are currently no student enrollments to display.</p>
                </div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <FiUser className="mr-2" /> User
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <FiMail className="mr-2" /> Email
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <FiBook className="mr-2" /> Course
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <FiClock className="mr-2" /> Enrolled At
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {enrollments.map((e) => (
                                    <tr key={e.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <FiUser className="text-blue-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{e.user.name}</div>
                                                    <div className="text-sm text-gray-500">ID: {e.user.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {e.user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 font-medium">{e.course.title}</div>
                                            <div className="text-sm text-gray-500">Course ID: {e.course.id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(e.enrolled_at).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(e.enrolled_at).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {e.is_active ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 flex items-center">
                                                    <FiCheckCircle className="mr-1" /> Active
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 flex items-center">
                                                    <FiXCircle className="mr-1" /> Inactive
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}