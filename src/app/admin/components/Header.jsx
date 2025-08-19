'use client';
import { FiBell, FiSearch, FiMenu } from 'react-icons/fi';
import { useState } from 'react';
import Image from 'next/image';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
                <button
                    className="md:hidden text-gray-500 focus:outline-none"
                    onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                >
                    <FiMenu size={24} />
                </button>

                <div className="relative max-w-md w-full mx-4 hidden md:block">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <FiBell size={20} />
                        <span className="sr-only">View notifications</span>
                    </button>

                    <div className="relative">
                        <button className="flex items-center focus:outline-none">
                            <Image
                                className="h-8 w-8 rounded-full"
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                width={32}
                                height={32}
                                alt="Admin user"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700 hidden md:inline">Admin</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}