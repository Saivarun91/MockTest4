// src/components/Navbar.jsx
'use client';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon, UserCircleIcon, AcademicCapIcon, BookOpenIcon, ChatBubbleBottomCenterTextIcon, CogIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
export default function Navbar() {
    const { user, logout, courses } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [isCoursesOpen, setIsCoursesOpen] = useState(false);
    const pathname = usePathname();
    const dropdownRef = useRef(null);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const router = useRouter();

    const userDropdownRef = useRef(null);
    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully")
        router.push('/auth/login')
    }


    const navLinks = [
        { name: 'Home', href: '/', icon: <UserCircleIcon className="h-5 w-5 mr-2" /> },
        { name: 'Blog', href: '/blog', icon: <BookOpenIcon className="h-5 w-5 mr-2" /> },
        { name: 'Testimonials', href: '/testimonials', icon: <ChatBubbleBottomCenterTextIcon className="h-5 w-5 mr-2" /> },
    ];

    // Get unique categories from dynamic courses
    const categories = [...new Set(courses.map(course => course.category))];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsCoursesOpen(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-105">
                            <AcademicCapIcon className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 hidden sm:inline-block font-playfair">
                          Prep<span className="text-blue-600">Tara</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center px-3 py-2 rounded-md transition-colors ${pathname === link.href ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}

                        {/* All Courses Dropdown by Category */}
                        <div
                            className="relative"
                            ref={dropdownRef}
                            onMouseEnter={() => setIsCoursesOpen(true)}
                            onMouseLeave={() => setIsCoursesOpen(false)}
                        >
                            <button
                                className={`flex items-center px-3 py-2 rounded-md transition-colors ${isCoursesOpen ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                            >
                                <AcademicCapIcon className="h-5 w-5 mr-2" />
                                All Courses
                                <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform ${isCoursesOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isCoursesOpen && (
                                <div className="absolute left-0 mt-1 w-64 bg-white shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto border border-gray-200 animate-fadeIn">
                                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                        <h3 className="text-sm font-medium text-gray-700">Browse by Category</h3>
                                    </div>
                                    <ul className="py-2">
                                        {categories.map((category) => (
                                            <li key={category}>
                                                <Link
                                                    href={`/courses/${encodeURIComponent(category)}`}
                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                    onClick={() => setIsCoursesOpen(false)}
                                                >
                                                    <span className="truncate">{category}</span>
                                                    <span className="ml-auto text-xs text-gray-500">
                                                        {courses.filter(course => course.category === category).length} courses
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-3">
                        {user ? (
                            <div className="relative" ref={userDropdownRef}>
                                <button
                                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <ChevronDownIcon className={`h-4 w-4 text-gray-600 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isUserDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 animate-fadeIn">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900 truncate">{user.name || user.email}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            onClick={() => setIsUserDropdownOpen(false)}
                                        >
                                            <UserCircleIcon className="h-4 w-4 mr-2" />
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        >
                                            <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>


                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition-colors"
                    >
                        {isOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center px-4 py-3 rounded-md ${pathname === link.href ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.icon}
                                <span className="ml-2">{link.name}</span>
                            </Link>
                        ))}

                        {/* Mobile Courses Dropdown */}
                        <div className="px-4 py-3">
                            <button
                                onClick={() => setIsCoursesOpen(!isCoursesOpen)}
                                className="flex items-center w-full text-gray-600 hover:text-blue-600"
                            >
                                <AcademicCapIcon className="h-5 w-5 mr-2" />
                                All Courses
                                <ChevronDownIcon className={`h-4 w-4 ml-auto transition-transform ${isCoursesOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isCoursesOpen && (
                                <div className="mt-2 ml-7 space-y-2">
                                    {categories.map((category) => (
                                        <Link
                                            key={category}
                                            href={`/courses/${encodeURIComponent(category)}`}
                                            className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                                            onClick={() => {
                                                setIsCoursesOpen(false);
                                                setIsOpen(false);
                                            }}
                                        >
                                            {category}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t border-gray-200 space-y-3">
                            {user ? (
                                <>
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-3 text-center text-gray-600 hover:bg-gray-50 rounded-md font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsOpen(false);
                                        }}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md text-center font-medium shadow-md"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/login"
                                        className="block px-4 py-3 text-center text-gray-600 hover:bg-gray-50 rounded-md font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md text-center font-medium shadow-md"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Animation styles */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out forwards;
                }
            `}</style>
        </header>
    );
}
