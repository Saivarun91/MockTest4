
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiEdit, FiTrash2, FiPlus, FiCheck, FiX, FiUpload, FiDownload, FiChevronRight, FiSearch } from 'react-icons/fi';
import { FaChalkboardTeacher, FaMoneyBillWave, FaUsers, FaClock, FaQuestionCircle } from 'react-icons/fa';

export default function QuestionManagement() {
    const [questions, setQuestions] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddQuestion, setShowAddQuestion] = useState(false);
    const [showEditQuestion, setShowEditQuestion] = useState(false);
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [isEditingQuestion, setIsEditingQuestion] = useState(false);
    const [isUploadingCSV, setIsUploadingCSV] = useState(false);
    const [selectedCSVFile, setSelectedCSVFile] = useState(null);
    const [showUploadCSV, setShowUploadCSV] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [showBulkDelete, setShowBulkDelete] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams.get('courseId');
    console.log(courseId)

    const [questionForm, setQuestionForm] = useState({
        course_id: courseId || '',
        question_text: '',
        question_type: 'MCQ',
        options: ['', '', '', ''],
        correct_answers: [],
        marks: 1,
        difficulty: 'medium',
        explanation: ''
    });
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedCSVFile(e.target.files[0]);
        } else {
            setSelectedCSVFile(null);
        }
    };

    useEffect(() => {
        fetchData();
    }, [courseId]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('adminToken');

            // Fetch courses with exams
            const coursesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (coursesResponse.ok) {
                const coursesData = await coursesResponse.json();
                setCourses(coursesData.courses || []);
            }

            // Fetch questions for selected course if courseId exists
            if (courseId) {
                const questionsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams/questions/?course_id=${courseId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (questionsResponse.ok) {
                    const questionsData = await questionsResponse.json();
                    setQuestions(questionsData.questions || []);
                }
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        setIsAddingQuestion(true);
        try {
            const token = localStorage.getItem('adminToken');

            // Validate correct answers
            if (questionForm.correct_answers.length === 0) {
                alert('Please select at least one correct answer');
                return;
            }

            const questionData = {
                course_id: questionForm.course_id,
                question_text: questionForm.question_text,
                question_type: questionForm.question_type,
                options: questionForm.options.filter(option => option.trim() !== ''),
                correct_answers: questionForm.correct_answers,
                marks: questionForm.marks,
                difficulty: questionForm.difficulty,
                explanation: questionForm.explanation
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams/questions/create/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(questionData)
            });

            if (response.ok) {
                setShowAddQuestion(false);
                setQuestionForm({
                    course_id: '',
                    question_text: '',
                    question_type: 'MCQ',
                    options: ['', '', '', ''],
                    correct_answers: [],
                    marks: 1,
                    difficulty: 'medium',
                    explanation: ''
                });
                fetchData();
                alert('Question added successfully!');
            } else {
                const errorData = await response.json();
                alert(`Error adding question: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error adding question:', error);
            alert('Error adding question. Please try again.');
        }
    };

    const filteredCourses = courses.filter(course => {
        return course.has_exam || course.questions_count > 0;
    });

    const filteredQuestions = questions.filter(question => {
        const matchesSearch = question.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            question.explanation?.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'mcq') return matchesSearch && question.question_type === 'MCQ';
        if (activeTab === 'single') return matchesSearch && question.question_type === 'SINGLE';
        if (activeTab === 'true_false') return matchesSearch && question.question_type === 'TRUE_FALSE';
        return matchesSearch;
    });

    const handleEditQuestion = async (e) => {
        e.preventDefault();
        setIsEditingQuestion(true);
        try {
            const token = localStorage.getItem('adminToken');

            if (!editingQuestion) return;

            const questionData = {
                question_text: questionForm.question_text,
                question_type: questionForm.question_type,
                options: questionForm.options.filter(option => option.trim() !== ''),
                correct_answers: questionForm.correct_answers,
                marks: questionForm.marks,
                difficulty: questionForm.difficulty,
                explanation: questionForm.explanation
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams/questions/${editingQuestion.id}/update/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(questionData)
            });

            if (response.ok) {
                setShowEditQuestion(false);
                setEditingQuestion(null);
                setQuestionForm({
                    course_id: '',
                    question_text: '',
                    question_type: 'MCQ',
                    options: ['', '', '', ''],
                    correct_answers: [],
                    marks: 1,
                    difficulty: 'medium',
                    explanation: ''
                });
                fetchData();
                alert('Question updated successfully!');
            } else {
                const errorData = await response.json();
                alert(`Error updating question: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating question:', error);
            alert('Error updating question. Please try again.');
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        if (confirm('Are you sure you want to delete this question?')) {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams/questions/${questionId}/delete/`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    fetchData();
                    alert('Question deleted successfully!');
                } else {
                    const errorData = await response.json();
                    alert(`Error deleting question: ${errorData.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error deleting question:', error);
                alert('Error deleting question. Please try again.');
            }
        }
    };

    const handleBulkDeleteQuestions = async () => {
        if (selectedQuestions.length === 0) {
            alert('Please select questions to delete');
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams/questions/bulk-delete/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question_ids: selectedQuestions })
            });

            if (response.ok) {
                setSelectedQuestions([]);
                setShowBulkDelete(false);
                fetchData();
                alert('Questions deleted successfully!');
            } else {
                const errorData = await response.json();
                alert(`Error deleting questions: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error deleting questions:', error);
            alert('Error deleting questions. Please try again.');
        }

    };

    const openEditModal = (question) => {
        setEditingQuestion(question);
        setQuestionForm({
            course_id: question.course_id,
            question_text: question.question_text,
            question_type: question.question_type,
            options: question.options,
            correct_answers: question.correct_answers,
            marks: question.marks,
            difficulty: question.difficulty,
            explanation: question.explanation || ''
        });
        setShowEditQuestion(true);
    };

    const handleQuestionSelection = (questionId) => {
        setSelectedQuestions(prev =>
            prev.includes(questionId)
                ? prev.filter(id => id !== questionId)
                : [...prev, questionId]
        );
    };

    const handleSelectAll = () => {
        if (selectedQuestions.length === questions.length) {
            setSelectedQuestions([]);
        } else {
            setSelectedQuestions(questions.map(question => question.id));
        }
    };

    const handleCSVUpload = async (e) => {
        e.preventDefault();
        setIsUploadingCSV(true);
        const formData = new FormData();
        const fileInput = document.getElementById('csvFile');
        formData.append('csv_file', fileInput.files[0]);
        formData.append('course_id', selectedCourse);

        try {
            const token = localStorage.getItem('adminToken');
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams/questions/upload-csv/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                setShowUploadCSV(false);
                setSelectedCourse('');
                fetchData();
                alert('Questions uploaded successfully!');
            } else {
                const errorData = await response.json();
                alert(`Error uploading CSV: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error uploading CSV:', error);
            alert('Error uploading CSV. Please try again.');
        }
    };

    const handleCorrectAnswerChange = (index) => {
        let newCorrectAnswers = [];
    
        if (questionForm.question_type === 'MCQ') {
            // Toggle behavior (multiple answers allowed)
            newCorrectAnswers = [...questionForm.correct_answers];
            const answerIndex = newCorrectAnswers.indexOf(index);
            if (answerIndex > -1) {
                newCorrectAnswers.splice(answerIndex, 1); // uncheck
            } else {
                newCorrectAnswers.push(index); // check
            }
        } else {
            // SINGLE / TRUE_FALSE → replace with only one selected
            newCorrectAnswers = [index];
        }
    
        setQuestionForm({
            ...questionForm,
            correct_answers: newCorrectAnswers
        });
    };
    
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'hard': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'MCQ': return 'bg-blue-100 text-blue-800';
            case 'SINGLE': return 'bg-purple-100 text-purple-800';
            case 'TRUE_FALSE': return 'bg-indigo-100 text-indigo-800';
            default: return 'bg-gray-100 text-gray-800';
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
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {courseId ? 'Question Management' : 'Exam Courses'}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {courseId ? 'Manage all questions for this course' : 'Select a course to manage questions'}
                        </p>
                    </div>

                    {courseId ? (
                        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search questions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <button
                                onClick={() => setShowAddQuestion(true)}
                                className="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                                Add Question
                            </button>
                            <button
                                onClick={() => setShowUploadCSV(true)}
                                className="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                <FiUpload className="-ml-1 mr-2 h-5 w-5" />
                                Upload CSV
                            </button>
                        </div>
                    ) : null}
                </div>

                {!courseId ? (
                    <>
                        {/* Courses with Exams Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map((course) => (
                                <div
                                    key={course.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1"
                                    onClick={() => router.push(`/admin/questions?courseId=${course.id}`)}
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-1">{course.title}</h3>
                                                <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                                            </div>
                                            <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                {course.questions_count || 0} Qs
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                                <FaChalkboardTeacher className="mr-2 text-blue-500" />
                                                {course.category}
                                            </div>

                                            <div className="flex justify-between items-center mt-4">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FaUsers className="mr-1.5 text-green-500" />
                                                    <span>{course.enrolled_count || 0} students</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Active
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">Last updated</span>
                                                <span className="text-sm font-medium text-gray-900">2 days ago</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                                        <span className="text-sm text-gray-500">View questions</span>
                                        <FiChevronRight className="text-gray-400" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredCourses.length === 0 && (
                            <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
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
                                <h3 className="mt-2 text-lg font-medium text-gray-900">No exam courses found</h3>
                                <p className="mt-1 text-gray-500">
                                    Courses with exams will appear here once created
                                </p>
                                <div className="mt-6">
                                    <button
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Create New Course
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {/* Questions Management Section */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                            <div className="flex space-x-1 rounded-md bg-gray-100 p-1">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-3 py-2 cursor-pointer text-sm font-medium rounded-md ${activeTab === 'all' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                                >
                                    All Questions
                                </button>
                                <button
                                    onClick={() => setActiveTab('mcq')}
                                    className={`px-3 py-2 text-sm cursor-pointer font-medium rounded-md ${activeTab === 'mcq' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                                >
                                    Multiple Choice
                                </button>
                                <button
                                    onClick={() => setActiveTab('single')}
                                    className={`px-3 py-2 text-sm cursor-pointer font-medium rounded-md ${activeTab === 'single' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                                >
                                    Single Choice
                                </button>
                                <button
                                    onClick={() => setActiveTab('true_false')}
                                    className={`px-3 py-2 text-sm cursor-pointer font-medium rounded-md ${activeTab === 'true_false' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                                >
                                    True/False
                                </button>
                            </div>

                            <div className="flex items-center space-x-4">
                                {selectedQuestions.length > 0 && (
                                    <button
                                        onClick={() => setShowBulkDelete(true)}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <FiTrash2 className="mr-1.5 h-3.5 w-3.5" />
                                        Delete Selected ({selectedQuestions.length})
                                    </button>
                                )}
                                <button
                                    onClick={() => router.push('/admin/courses')}
                                    className="inline-flex items-center px-3 py-1.5 cursor-pointer border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <FiChevronRight className="transform rotate-180 mr-1.5 h-4 w-4" />
                                    Back to Courses
                                </button>
                            </div>
                        </div>

                        {/* Questions List */}
                        <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
                            {filteredQuestions.length === 0 ? (
                                <div className="p-8 text-center">
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
                                    <h3 className="mt-2 text-lg font-medium text-gray-900">No questions found</h3>
                                    <p className="mt-1 text-gray-500">
                                        {searchTerm ? 'Try a different search term' : 'Add your first question to get started'}
                                    </p>
                                    <div className="mt-6 space-x-3">
                                        <button
                                            onClick={() => setShowAddQuestion(true)}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                                            Add Question
                                        </button>
                                        <button
                                            onClick={() => setShowUploadCSV(true)}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                        >
                                            <FiUpload className="-ml-1 mr-2 h-5 w-5" />
                                            Upload CSV
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {filteredQuestions.map((question) => (
                                        <li key={question.id} className="hover:bg-gray-50">
                                            <div className="px-4 py-4 sm:px-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedQuestions.includes(question.id)}
                                                            onChange={() => handleQuestionSelection(question.id)}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                                                        />
                                                        <p className="text-sm font-medium text-blue-600 truncate">
                                                            {question.question_text}
                                                        </p>
                                                    </div>
                                                    <div className="ml-2 flex-shrink-0 flex">
                                                        <div className={`ml-2 flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full ${getDifficultyColor(question.difficulty)}`}>
                                                            <span className="text-xs font-medium">{question.difficulty.charAt(0).toUpperCase()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-2 sm:flex sm:justify-between">
                                                    <div className="sm:flex">
                                                        <div className="flex items-center text-sm text-gray-500 mr-4">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(question.question_type)} mr-2`}>
                                                                {question.question_type}
                                                            </span>
                                                            <span className="font-medium text-gray-900">
                                                                {question.marks} mark{question.marks !== 1 ? 's' : ''}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => openEditModal(question)}
                                                                className="inline-flex cursor-pointer items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                            >
                                                                <FiEdit className="mr-1.5 h-3.5 w-3.5" />
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteQuestion(question.id)}
                                                                className="inline-flex cursor-pointer items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                            >
                                                                <FiTrash2 className="mr-1.5 h-3.5 w-3.5" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {question.options.length > 0 && (
                                                    <div className="mt-3">
                                                        <h4 className="text-sm font-medium text-gray-700 mb-1">Options:</h4>
                                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            {question.options.map((option, index) => (
                                                                <li
                                                                    key={index}
                                                                    className={`text-sm p-2 rounded border ${question.correct_answers.includes(index) ? 'bg-green-50 text-green-800 border-green-200' : 'bg-gray-50 text-gray-800 border-gray-200'}`}
                                                                >
                                                                    <div className="flex items-center">
                                                                        <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                                                                        <span>{option}</span>
                                                                        {question.correct_answers.includes(index) && (
                                                                            <span className="ml-auto text-green-600 text-xs font-medium">✓ Correct</span>
                                                                        )}
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {question.explanation && (
                                                    <div className="mt-3">
                                                        <h4 className="text-sm font-medium text-gray-700">Explanation:</h4>
                                                        <p className="mt-1 text-sm text-gray-600">{question.explanation}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </>
                )}
            </div>
            {/* Bulk Delete Modal */}
            {showBulkDelete && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900">Delete Questions</h3>
                            <button
                                onClick={() => setShowBulkDelete(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <FiX className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="mt-4">
                            <p className="text-gray-600">
                                Are you sure you want to delete {selectedQuestions.length} selected questions?
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowBulkDelete(false)}
                                className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleBulkDeleteQuestions}
                                className="px-4 py-2 cursor-pointer border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Question Modal */}
            {showAddQuestion && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="relative bg-white rounded-lg shadow-xl w-4/5 max-h-[90vh] overflow-y-auto p-6 mx-auto">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900">Add New Question</h3>
                            <button
                                onClick={() => setShowAddQuestion(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <FiX className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAddQuestion} className="space-y-4">
                            <div>
                                <label htmlFor="course" className="block text-sm font-medium text-gray-700">Course</label>
                                <select
                                    id="course"
                                    value={questionForm.course_id}
                                    onChange={(e) => setQuestionForm({ ...questionForm, course_id: e.target.value })}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    required
                                >
                                    <option value="">Select Course</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>{course.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="question_text" className="block text-sm font-medium text-gray-700">Question Text</label>
                                <textarea
                                    id="question_text"
                                    placeholder="Enter the question text"
                                    value={questionForm.question_text}
                                    onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="question_type" className="block text-sm font-medium text-gray-700">Question Type</label>
                                    <select
                                        id="question_type"
                                        value={questionForm.question_type}
                                        onChange={(e) => setQuestionForm({ ...questionForm, question_type: e.target.value })}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option value="MCQ">Multiple Choice</option>
                                        <option value="SINGLE">Single Choice</option>
                                        <option value="TRUE_FALSE">True/False</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty</label>
                                    <select
                                        id="difficulty"
                                        value={questionForm.difficulty}
                                        onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="marks" className="block text-sm font-medium text-gray-700">Marks</label>
                                <input
                                    type="number"
                                    id="marks"
                                    placeholder="Enter marks"
                                    value={questionForm.marks}
                                    onChange={(e) => setQuestionForm({ ...questionForm, marks: parseInt(e.target.value) || 1 })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    min="1"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Options</label>
                                <div className="mt-1 space-y-2">
                                    {questionForm.options.map((option, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                type={questionForm.question_type === 'SINGLE' ? 'radio' : 'checkbox'}
                                                name="correct_answers"
                                                checked={questionForm.correct_answers.includes(index)}
                                                onChange={() => handleCorrectAnswerChange(index)}
                                                className={`focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 ${questionForm.question_type === 'SINGLE' ? 'rounded-full' : 'rounded'}`}
                                            />
                                            <input
                                                type="text"
                                                placeholder={`Option ${index + 1}`}
                                                value={option}
                                                onChange={(e) => {
                                                    const newOptions = [...questionForm.options];
                                                    newOptions[index] = e.target.value;
                                                    setQuestionForm({ ...questionForm, options: newOptions });
                                                }}
                                                className="ml-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                required={index < 2}
                                            />
                                            {index >= 2 && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newOptions = [...questionForm.options];
                                                        newOptions.splice(index, 1);
                                                        setQuestionForm({ ...questionForm, options: newOptions });
                                                    }}
                                                    className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                >
                                                    <FiX className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {questionForm.options.length < 6 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newOptions = [...questionForm.options, ''];
                                                setQuestionForm({ ...questionForm, options: newOptions });
                                            }}
                                            className="inline-flex cursor-pointer items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <FiPlus className="-ml-0.5 mr-1.5 h-4 w-4" />
                                            Add Option
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="explanation" className="block text-sm font-medium text-gray-700">Explanation (Optional)</label>
                                <textarea
                                    id="explanation"
                                    placeholder="Enter explanation for the correct answer"
                                    value={questionForm.explanation}
                                    onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    rows="2"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddQuestion(false)}
                                    className="inline-flex cursor-pointer items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    disabled={isAddingQuestion}
                                >
                                    {isAddingQuestion ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Adding...
                                        </>
                                    ) : (
                                        'Add Question'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Question Modal */}
            {showEditQuestion && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="relative bg-white rounded-lg shadow-xl w-4/5 max-h-[90vh] overflow-y-auto p-6 mx-auto">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900">Edit Question</h3>
                            <button
                                onClick={() => setShowEditQuestion(false)}
                                className="text-gray-400 cursor-pointer hover:text-gray-500"
                            >
                                <FiX className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleEditQuestion} className="space-y-4">
                            <div>
                                <label htmlFor="edit_question_text" className="block text-sm font-medium text-gray-700">Question Text</label>
                                <textarea
                                    id="edit_question_text"
                                    placeholder="Enter the question text"
                                    value={questionForm.question_text}
                                    onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="edit_question_type" className="block text-sm font-medium text-gray-700">Question Type</label>
                                    <select
                                        id="edit_question_type"
                                        value={questionForm.question_type}
                                        onChange={(e) => setQuestionForm({ ...questionForm, question_type: e.target.value })}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option value="MCQ">Multiple Choice</option>
                                        <option value="SINGLE">Single Choice</option>
                                        <option value="TRUE_FALSE">True/False</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="edit_difficulty" className="block text-sm font-medium text-gray-700">Difficulty</label>
                                    <select
                                        id="edit_difficulty"
                                        value={questionForm.difficulty}
                                        onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="edit_marks" className="block text-sm font-medium text-gray-700">Marks</label>
                                <input
                                    type="number"
                                    id="edit_marks"
                                    placeholder="Enter marks"
                                    value={questionForm.marks}
                                    onChange={(e) => setQuestionForm({ ...questionForm, marks: parseInt(e.target.value) || 1 })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    min="1"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Options</label>
                                <div className="mt-1 space-y-2">
                                    {questionForm.options.map((option, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                type={questionForm.question_type === 'SINGLE' ? 'radio' : 'checkbox'}
                                                name="edit_correct_answers"
                                                checked={questionForm.correct_answers.includes(index)}
                                                onChange={() => handleCorrectAnswerChange(index)}
                                                className={`focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 ${questionForm.question_type === 'SINGLE' ? 'rounded-full' : 'rounded'}`}
                                            />
                                            <input
                                                type="text"
                                                placeholder={`Option ${index + 1}`}
                                                value={option}
                                                onChange={(e) => {
                                                    const newOptions = [...questionForm.options];
                                                    newOptions[index] = e.target.value;
                                                    setQuestionForm({ ...questionForm, options: newOptions });
                                                }}
                                                className="ml-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                required={index < 2}
                                            />
                                            {index >= 2 && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newOptions = [...questionForm.options];
                                                        newOptions.splice(index, 1);
                                                        setQuestionForm({ ...questionForm, options: newOptions });
                                                    }}
                                                    className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                >
                                                    <FiX className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {questionForm.options.length < 6 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newOptions = [...questionForm.options, ''];
                                                setQuestionForm({ ...questionForm, options: newOptions });
                                            }}
                                            className="inline-flex cursor-pointer items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <FiPlus className="-ml-0.5 mr-1.5 h-4 w-4" />
                                            Add Option
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="edit_explanation" className="block text-sm font-medium text-gray-700">Explanation (Optional)</label>
                                <textarea
                                    id="edit_explanation"
                                    placeholder="Enter explanation for the correct answer"
                                    value={questionForm.explanation}
                                    onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    rows="2"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditQuestion(false)}
                                    className="inline-flex cursor-pointer items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    disabled={isEditingQuestion}
                                >
                                    {isEditingQuestion ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Question'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Upload CSV Modal */}
            {showUploadCSV && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900">Upload Questions from CSV</h3>
                            <button
                                onClick={() => setShowUploadCSV(false)}
                                className="text-gray-400 cursor-pointer hover:text-gray-500"
                            >
                                <FiX className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCSVUpload} className="space-y-4">
                            <div>
                                <label htmlFor="upload_course" className="block text-sm font-medium text-gray-700">Course</label>
                                <select
                                    id="upload_course"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    required
                                >
                                    <option value="">Select Course</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>{course.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="csvFile" className="block text-sm font-medium text-gray-700">CSV File</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="csvFile"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                            >
                                                <span>Upload a file</span>
                                                <input
                                                    id="csvFile"
                                                    name="csvFile"
                                                    type="file"
                                                    className="sr-only"
                                                    accept=".csv"
                                                    onChange={handleFileChange}
                                                    required
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        {selectedCSVFile && (
                                            <p className="text-sm text-gray-900 mt-2">
                                                Selected: {selectedCSVFile.name} ({Math.round(selectedCSVFile.size / 1024)} KB)
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500">CSV up to 10MB</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadCSV(false)}
                                    className="inline-flex cursor-pointer items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    disabled={isUploadingCSV}
                                >
                                    {isUploadingCSV ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Uploading...
                                        </>
                                    ) : (
                                        'Upload Questions'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}