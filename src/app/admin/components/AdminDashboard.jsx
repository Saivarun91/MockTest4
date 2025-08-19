'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import StatsCard from './StatsCard';
import DataTable from './DataTable';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCourses: 0,
        totalRevenue: 0,
        totalTests: 0
    });
    const [recentEnrollments, setRecentEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            // Fetch dashboard stats
            const statsResponse = await fetch('process.env.NEXT_PUBLIC_API_URL/api/courses/admin/stats/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                setStats(statsData);
            } else {
                console.error('Error fetching stats:', statsResponse.status);
            }

            // Fetch recent enrollments
            const enrollmentsResponse = await fetch('process.env.NEXT_PUBLIC_API_URL/api/courses/admin/recent-enrollments/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (enrollmentsResponse.ok) {
                const enrollmentsData = await enrollmentsResponse.json();
                setRecentEnrollments(enrollmentsData.enrollments || []);
            } else {
                console.error('Error fetching enrollments:', enrollmentsResponse.status);
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-2">Manage your platform and monitor performance</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatsCard
                            title="Total Students"
                            value={stats.totalStudents}
                            icon="👥"
                            color="blue"
                        />
                        <StatsCard
                            title="Total Courses"
                            value={stats.totalCourses}
                            icon="📚"
                            color="purple"
                        />
                        <StatsCard
                            title="Total Tests"
                            value={stats.totalTests}
                            icon="📝"
                            color="green"
                        />
                        <StatsCard
                            title="Total Revenue"
                            value={`₹${stats.totalRevenue.toLocaleString()}`}
                            icon="💰"
                            color="yellow"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Enrollments */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Recent Enrollments</h2>
                            <div className="space-y-3">
                                {recentEnrollments.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No recent enrollments</p>
                                ) : (
                                    recentEnrollments.map((enrollment, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                            <div>
                                                <p className="font-medium">{enrollment.student_name}</p>
                                                <p className="text-sm text-gray-600">{enrollment.course_title}</p>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(enrollment.enrolled_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push('/admin/courses')}
                                    className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 text-left"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add New Course
                                    </div>
                                </button>
                                <button
                                    onClick={() => router.push('/admin/exams')}
                                    className="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600 text-left"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Manage Questions
                                    </div>
                                </button>
                                <button
                                    onClick={() => router.push('/admin/students')}
                                    className="w-full p-3 bg-purple-500 text-white rounded hover:bg-purple-600 text-left"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                        View Students
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
} 