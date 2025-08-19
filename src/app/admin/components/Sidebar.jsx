'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const navigation = [
        {
            name: 'Courses',
            href: '/admin/courses',
            icon: '📚',
            current: pathname === '/admin/courses'
        },
        {
            name: 'Enrollments',
            href: '/admin/students',
            icon: '👥',
            current: pathname === '/admin/students'
        },
        {
            name: 'Settings',
            href: '/admin/settings',
            icon: '⚙️',
            current: pathname === '/admin/settings'
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin');
    };

    return (
        <div className={`bg-gradient-to-b from-gray-800 to-gray-900 text-white transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'} h-screen flex flex-col shadow-xl`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                {!isCollapsed && (
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Admin Panel</h1>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? (
                        <span className="text-xl">→</span>
                    ) : (
                        <span className="text-xl">←</span>
                    )}
                </button>
            </div>

            <nav className="mt-8 flex-1">
                <ul className="space-y-2 px-2">
                    {navigation.map((item) => (
                        <li key={item.name}>
                            <button
                                onClick={() => router.push(item.href)}
                                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0 py-4' : 'px-4 py-3'} rounded-lg transition-all duration-200 ${item.current
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                <span className={`text-xl ${!isCollapsed ? 'mr-3' : ''}`}>{item.icon}</span>
                                {!isCollapsed && (
                                    <span className="font-medium">{item.name}</span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0 py-4' : 'px-4 py-3'} rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200`}
                >
                    <span className={`text-xl ${!isCollapsed ? 'mr-3' : ''}`}>🚪</span>
                    {!isCollapsed && (
                        <span className="font-medium">Logout</span>
                    )}
                </button>
            </div>
        </div>
    );
}