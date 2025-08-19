'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { FiEdit, FiTrash2, FiPlus, FiCheck, FiX, FiUpload, FiDownload } from 'react-icons/fi';
import { FaChalkboardTeacher, FaMoneyBillWave, FaUsers, FaClock } from 'react-icons/fa';

export default function CourseManagement() {
    const { courses, removeCourse, removeCourses, fetchCourses } = useUser();
    const [loading, setLoading] = useState(true);
    const [showAddCourse, setShowAddCourse] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [showBulkDelete, setShowBulkDelete] = useState(false);
    const router = useRouter();
    const [showEditCourse, setShowEditCourse] = useState(false);
    const [editCourseId, setEditCourseId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const [courseForm, setCourseForm] = useState({
        slug: '',
        title: '',
        description: '',
        category: '',
        price: '',
        duration: '',
        questions: '',
        features: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await fetchCourses();
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            const slug = courseForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

            const courseData = {
                slug: slug,
                title: courseForm.title,
                description: courseForm.description || '',
                category: courseForm.category,
                price: parseFloat(courseForm.price),
                duration: courseForm.duration || '',
                questions: courseForm.questions || '',
                features: courseForm.features || [],
                new: true,
                lastUpdated: new Date().toISOString()
            };

            const response = await fetch('process.env.NEXT_PUBLIC_API_URL/api/courses/create/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(courseData)
            });

            if (response.ok) {
                setShowAddCourse(false);
                setCourseForm({
                    slug: '',
                    title: '',
                    description: '',
                    category: '',
                    price: '',
                    duration: '',
                    questions: '',
                    features: []
                });
                await fetchCourses();
                alert('Course created successfully!');
            } else {
                const errorData = await response.json();
                alert(`Error creating course: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error adding course:', error);
            alert('Error creating course. Please try again.');
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (confirm('Are you sure you want to delete this course?')) {
            try {
                const token = localStorage.getItem('token');
                const course = courses.find(c => c.id === courseId);

                if (!course) {
                    alert('Course not found');
                    return;
                }

                const response = await fetch(`process.env.NEXT_PUBLIC_API_URL/api/courses/delete/${course.slug}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    removeCourse(courseId);
                    alert('Course deleted successfully!');
                } else {
                    const errorData = await response.json();
                    alert(`Error deleting course: ${errorData.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error deleting course:', error);
                alert('Error deleting course. Please try again.');
            }
        }
    };

    const handleBulkDeleteCourses = async () => {
        if (selectedCourses.length === 0) {
            alert('Please select courses to delete');
            return;
        }

        if (confirm(`Are you sure you want to delete ${selectedCourses.length} courses?`)) {
            try {
                const token = localStorage.getItem('adminToken');
                const courseSlugs = selectedCourses.map(id => {
                    const course = courses.find(c => c.id === id);
                    return course ? course.slug : null;
                }).filter(Boolean);

                const response = await fetch('process.env.NEXT_PUBLIC_API_URL/api/courses/bulk-delete/', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ course_slugs: courseSlugs })
                });

                if (response.ok) {
                    removeCourses(selectedCourses);
                    setSelectedCourses([]);
                    setShowBulkDelete(false);
                    alert('Courses deleted successfully!');
                } else {
                    const errorData = await response.json();
                    alert(`Error deleting courses: ${errorData.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error deleting courses:', error);
                alert('Error deleting courses. Please try again.');
            }
        }
    };

    const handleCourseSelection = (courseId) => {
        setSelectedCourses(prev =>
            prev.includes(courseId)
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`process.env.NEXT_PUBLIC_API_URL/api/courses/update/${courseForm.slug}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(courseForm)
            });

            if (response.ok) {
                setShowEditCourse(false);
                setEditCourseId(null);
                await fetchCourses();
                alert('Course updated successfully!');
            } else {
                const errorData = await response.json();
                alert(`Error updating course: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating course:', error);
            alert('Error updating course. Please try again.');
        }
    };

    const handleSelectAll = () => {
        if (selectedCourses.length === filteredCourses.length) {
            setSelectedCourses([]);
        } else {
            setSelectedCourses(filteredCourses.map(course => course.id));
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'popular') return matchesSearch && (course.enrolled_count || 0) > 50;
        if (activeTab === 'new') return matchesSearch && course.new;
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
                        <p className="text-gray-600 mt-2">Manage all your courses in one place</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <svg
                                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                            </svg>
                        </div>
                        <button
                            onClick={() => setShowAddCourse(true)}
                            className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FiPlus className="mr-2" />
                            Add Course
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-4 py-2 font-medium text-sm ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        All Courses
                    </button>
                    <button
                        onClick={() => setActiveTab('popular')}
                        className={`px-4 py-2 font-medium text-sm ${activeTab === 'popular' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Popular
                    </button>
                    <button
                        onClick={() => setActiveTab('new')}
                        className={`px-4 py-2 font-medium text-sm ${activeTab === 'new' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        New Arrivals
                    </button>
                </div>

                {/* Bulk Actions Bar */}
                {selectedCourses.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-center justify-between">
                        <div className="flex items-center">
                            <FiCheck className="text-blue-600 mr-2" />
                            <span className="text-blue-800 font-medium">
                                {selectedCourses.length} course{selectedCourses.length !== 1 ? 's' : ''} selected
                            </span>
                        </div>
                        <button
                            onClick={() => setShowBulkDelete(true)}
                            className="flex items-center text-red-600 hover:text-red-800"
                        >
                            <FiTrash2 className="mr-1" />
                            Delete Selected
                        </button>
                    </div>
                )}

                {/* Courses Grid */}
                {filteredCourses.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No courses found</h3>
                        <p className="mt-1 text-gray-500 cursor-pointer">
                            {searchTerm ? 'Try a different search term' : 'Create your first course to get started'}
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => setShowAddCourse(true)}
                                className="inline-flex items-center px-4 py-2 cursor-pointer border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                                Add Course
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="p-5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{course.description}</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={selectedCourses.includes(course.id)}
                                            onChange={() => handleCourseSelection(course.id)}
                                            className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mt-1 cursor-pointer"
                                        />
                                    </div>

                                    <div className="mt-4 flex items-center text-sm text-gray-500">
                                        <FaChalkboardTeacher className="mr-1.5" />
                                        {course.category}
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="flex items-center text-sm">
                                            <FaMoneyBillWave className="mr-1.5 text-green-500" />
                                            <span className="font-medium">₹{course.price}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <FaUsers className="mr-1.5 text-blue-500" />
                                            <span>{course.enrolled_count || 0} students</span>
                                        </div>
                                        {course.duration && (
                                            <div className="flex items-center text-sm">
                                                <FaClock className="mr-1.5 text-purple-500" />
                                                <span>{course.duration}</span>
                                            </div>
                                        )}
                                        {course.questions && (
                                            <div className="flex items-center text-sm">
                                                <svg className="mr-1.5 h-4 w-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                                <span>{course.questions} questions</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-5 flex justify-between">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    const courseData = courses.find(c => c.id === course.id);
                                                    setCourseForm({
                                                        slug: courseData.slug,
                                                        title: courseData.title,
                                                        description: courseData.description,
                                                        category: courseData.category,
                                                        price: courseData.price,
                                                        duration: courseData.duration,
                                                        questions: courseData.questions,
                                                        features: courseData.features || []
                                                    });
                                                    setEditCourseId(courseData.id);
                                                    setShowEditCourse(true);
                                                }}
                                                className="inline-flex cursor-pointer items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <FiEdit className="mr-1.5" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => router.push(`/admin/exams?courseId=${course.id}`)}
                                                className="inline-flex cursor-pointer items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                                Questions
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCourse(course.id)}
                                            className="inline-flex items-center cursor-pointer px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            <FiTrash2 className="mr-1.5" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bulk Delete Modal */}
            {showBulkDelete && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900">Confirm Bulk Delete</h3>
                            <button
                                onClick={() => setShowBulkDelete(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <FiX className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="mt-4">
                            <p className="text-gray-600">
                                Are you sure you want to delete {selectedCourses.length} selected courses?
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowBulkDelete(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBulkDeleteCourses}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Delete All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Course Modal */}
            {showAddCourse && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900">Add New Course</h3>
                            <button
                                onClick={() => setShowAddCourse(false)}
                                className="text-gray-400 hover:text-gray-500 cursor-pointer"
                            >
                                <FiX className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAddCourse} className="mt-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title*</label>
                                    <input
                                        type="text"
                                        id="title"
                                        placeholder="Course Title"
                                        value={courseForm.title}
                                        onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category*</label>
                                    <input
                                        type="text"
                                        id="category"
                                        placeholder="Category"
                                        value={courseForm.category}
                                        onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price*</label>
                                    <input
                                        type="number"
                                        id="price"
                                        placeholder="Price"
                                        value={courseForm.price}
                                        onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
                                    <input
                                        type="text"
                                        id="duration"
                                        placeholder="Duration"
                                        value={courseForm.duration}
                                        onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        id="description"
                                        placeholder="Description"
                                        value={courseForm.description}
                                        onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        rows="3"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="questions" className="block text-sm font-medium text-gray-700">Number of Questions</label>
                                    <input
                                        type="number"
                                        id="questions"
                                        placeholder="Number of Questions"
                                        value={courseForm.questions}
                                        onChange={(e) => setCourseForm({ ...courseForm, questions: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddCourse(false)}
                                    className="px-4 py-2 border cursor-pointer border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 cursor-pointer border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Add Course
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Course Modal */}
            {showEditCourse && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900">Edit Course</h3>
                            <button
                                onClick={() => setShowEditCourse(false)}
                                className="text-gray-400 hover:text-gray-500 cursor-pointer"
                            >
                                <FiX className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateCourse} className="mt-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">Title*</label>
                                    <input
                                        type="text"
                                        id="edit-title"
                                        placeholder="Course Title"
                                        value={courseForm.title}
                                        onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700">Category*</label>
                                    <input
                                        type="text"
                                        id="edit-category"
                                        placeholder="Category"
                                        value={courseForm.category}
                                        onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">Price*</label>
                                    <input
                                        type="number"
                                        id="edit-price"
                                        placeholder="Price"
                                        value={courseForm.price}
                                        onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="edit-duration" className="block text-sm font-medium text-gray-700">Duration</label>
                                    <input
                                        type="text"
                                        id="edit-duration"
                                        placeholder="Duration"
                                        value={courseForm.duration}
                                        onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        id="edit-description"
                                        placeholder="Description"
                                        value={courseForm.description}
                                        onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        rows="3"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="edit-questions" className="block text-sm font-medium text-gray-700">Number of Questions</label>
                                    <input
                                        type="number"
                                        id="edit-questions"
                                        placeholder="Number of Questions"
                                        value={courseForm.questions}
                                        onChange={(e) => setCourseForm({ ...courseForm, questions: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditCourse(false)}
                                    className="px-4 cursor-pointer py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 cursor-pointer border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}