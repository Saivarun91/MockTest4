'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { StarIcon, ArrowRightIcon, ChartBarIcon, ClockIcon, UserGroupIcon, CheckIcon, BoltIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function CourseCategoryPage() {
    const { category } = useParams();
    const decodedCategory = decodeURIComponent(category);
    const [hoveredCourse, setHoveredCourse] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCourses() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/category/${encodeURIComponent(decodedCategory)}/`);
                const data = await res.json();
                setCourses(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, [decodedCategory]);

    // Background images for different categories
    const categoryBackgrounds = {
        'Cloud Computing': 'bg-[url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")]',
        'Data Science': 'bg-[url("https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1085&q=80")]',
        'Security': 'bg-[url("https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")]',
        'Web Development': 'bg-[url("https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80")]',
        'Programming': 'bg-[url("https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")]',
        'Business & Strategy': 'bg-[url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")]',
        'CRM & Business': 'bg-[url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")]'
    };

    const backgroundClass = categoryBackgrounds[decodedCategory] || 'bg-gradient-to-r from-blue-600 to-indigo-700';

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-lg font-medium">Loading {decodedCategory} courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section with Background Image */}
            <div className={`${backgroundClass} bg-cover bg-center rounded-xl mb-8 text-white relative overflow-hidden min-h-[400px] flex items-center`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/40 z-0"></div>
                <div className="relative z-10 w-full px-8 py-12">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
                            <StarIcon className="h-5 w-5 mr-2 text-yellow-300" />
                            <span className="font-medium">Top Rated {decodedCategory} Courses</span>
                        </div>

                        {/* Main Heading with gradient text */}
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 leading-tight">
                            Master {decodedCategory} Like a Pro
                        </h1>

                        {/* Subheading */}
                        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
                            Join thousands who've aced their certification exams with our proven learning system
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <Link
                                href="/register"
                                className="px-8 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                Start Learning Today
                            </Link>
                            <Link
                                href="#courses"
                                className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all hover:scale-105"
                            >
                                Browse Courses
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-6 mt-8">
                            <div className="flex items-center">
                                <div className="bg-white/20 p-2 rounded-full mr-3">
                                    <UserGroupIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">10,000+</div>
                                    <div className="text-sm opacity-80">Students Enrolled</div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="bg-white/20 p-2 rounded-full mr-3">
                                    <ChartBarIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">95%</div>
                                    <div className="text-sm opacity-80">Pass Rate</div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="bg-white/20 p-2 rounded-full mr-3">
                                    <StarIcon className="h-6 w-6 text-yellow-300" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">4.8/5</div>
                                    <div className="text-sm opacity-80">Average Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating elements for visual interest */}
                <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-blue-400/20 backdrop-blur-sm"></div>
                <div className="absolute top-1/3 right-1/4 w-8 h-8 rounded-full bg-white/30"></div>
            </div>

            {/* Why Choose Us Section */}
            <div className="mb-12 bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Our {decodedCategory} Courses?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4">
                        <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                            <BoltIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Expert Instructors</h3>
                        <p className="text-gray-600">Learn from industry professionals with real-world experience</p>
                    </div>
                    <div className="text-center p-4">
                        <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                            <TrophyIcon className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Proven Results</h3>
                        <p className="text-gray-600">95% of our students pass their certification exams</p>
                    </div>
                    <div className="text-center p-4">
                        <div className="bg-purple-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                            <CheckIcon className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Practical Learning</h3>
                        <p className="text-gray-600">Hands-on labs and real-world projects</p>
                    </div>
                </div>
            </div>

            {/* Featured Courses */}
            <div className="mb-12" id="courses">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <span className="bg-blue-100 text-blue-800 p-2 rounded-lg mr-3">
                        <ChartBarIcon className="h-6 w-6" />
                    </span>
                    Popular {decodedCategory} Courses
                </h2>

                {courses.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <h3 className="text-xl font-medium text-gray-600">No courses found in this category</h3>
                        <p className="mt-2 text-gray-500">We're working on adding new courses. Check back soon!</p>
                        <Link href="/courses" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Browse All Courses
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <div
                                    key={course.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative"
                                    onMouseEnter={() => setHoveredCourse(course.id)}
                                    onMouseLeave={() => setHoveredCourse(null)}
                                >
                                    <div className="relative">
                                        <div className={`h-48 ${hoveredCourse === course.id ? 'bg-gradient-to-r from-blue-600 to-indigo-700' : 'bg-gradient-to-r from-blue-500 to-indigo-600'} flex items-center justify-center transition-all duration-300`}>
                                            <span className="text-white text-4xl font-bold transition-transform duration-300" style={{ transform: hoveredCourse === course.id ? 'scale(1.2)' : 'scale(1)' }}>
                                                {course.title.charAt(0)}
                                            </span>
                                        </div>
                                        {course.is_popular && (
                                            <div className="absolute top-4 left-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                Most Popular
                                            </div>
                                        )}
                                        {course.is_new && (
                                            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                New
                                            </div>
                                        )}
                                        {course.is_premium && (
                                            <div className="absolute bottom-4 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                Premium
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                                            <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                                <StarIcon className="h-4 w-4 mr-1 fill-yellow-400" />
                                                {course.avgRating || '4.8'}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <ClockIcon className="h-4 w-4 mr-1" />
                                                {course.duration || '6 weeks'}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <UserGroupIcon className="h-4 w-4 mr-1" />
                                                {course.students_enrolled || '1,200+'} students
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-gray-900">
                                                {course.price ? `$${course.price}` : 'Free'}
                                                {course.plans && course.plans.length > 1 && (
                                                    <span className="text-sm font-normal text-gray-500 ml-1">starting at</span>
                                                )}
                                            </span>
                                            <Link
                                                href={`/exams/${course.slug}`}
                                                className="flex items-center text-blue-600 hover:text-blue-800 font-medium group"
                                            >
                                                Explore <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Comparison Table */}
                        {courses.length > 1 && (
                            <div className="mt-12">
                                <h2 className="text-2xl font-bold mb-6 text-center">Course Comparison</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {courses.map((course) => (
                                                <tr key={course.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Link href={`/exams/${course.slug}`} className="text-blue-600 hover:text-blue-800 font-medium">
                                                            {course.title}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{course.duration || '6 weeks'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                                            course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                                                            course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {course.difficulty || 'Intermediate'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                                            <span>{course.avgRating || '4.8'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                        {course.price ? `$${course.price}` : 'Free'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Success Stories */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-bold mb-6 text-center">Success Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                <span className="text-blue-600 font-bold">SJ</span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Sarah Johnson</p>
                                <p className="text-sm text-gray-500">AWS Certified Solutions Architect</p>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-4">"The practice exams were incredibly similar to the real test. I passed on my first attempt with a score of 890!"</p>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-indigo-500">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                                <span className="text-indigo-600 font-bold">MC</span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Michael Chen</p>
                                <p className="text-sm text-gray-500">Google Cloud Certified</p>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-4">"The hands-on labs gave me the confidence to implement solutions in my job immediately after certification."</p>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-xl p-8 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')] bg-cover bg-center opacity-10"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-4">Ready to Ace Your {decodedCategory} Exam?</h2>
                    <p className="text-xl mb-6 max-w-2xl mx-auto">Join thousands of successful students who've passed their certification exams with our help</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/register"
                            className="px-6 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg hover:scale-105 transform transition-transform"
                        >
                            Get Started Now
                        </Link>
                        <Link
                            href="/courses"
                            className="px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors hover:scale-105 transform transition-transform"
                        >
                            Browse All Courses
                        </Link>
                    </div>
                    <div className="mt-6 flex flex-wrap justify-center gap-4">
                        <div className="flex items-center">
                            <CheckIcon className="h-5 w-5 mr-2" />
                            <span>7-day money back guarantee</span>
                        </div>
                        <div className="flex items-center">
                            <CheckIcon className="h-5 w-5 mr-2" />
                            <span>24/7 support</span>
                        </div>
                        <div className="flex items-center">
                            <CheckIcon className="h-5 w-5 mr-2" />
                            <span>Certificate upon completion</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}