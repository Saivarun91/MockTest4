'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');

        if (!token) {
            setIsAuthenticated(false);
            // If not logged in and not already on login page, go to login
            if (pathname !== '/admin') {
                router.push('/admin');
            }
        } else {
            setIsAuthenticated(true);
            // Optional: redirect to courses if visiting plain /admin
            if (pathname === '/admin') {
                router.push('/admin/courses');
            }
        }

        setLoading(false);
    }, [pathname, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // If not logged in, show only the login page content
    if (!isAuthenticated) {
        return children;
    }

    // Logged in: show admin layout with sidebar and header
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}
