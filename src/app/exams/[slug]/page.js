'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { allExams } from '@/data/exams';
import { CheckCircle, Star, Clock, BookOpen, Download, MessageSquare, Award, ChevronRight, Users, Shield, Trophy, Zap, BarChart2, BadgeCheck, Video, FileText, HelpCircle, ArrowRight, Percent, Calendar, Globe, Briefcase, TrendingUp } from 'lucide-react';
import Image from 'next/image';

const ExamPage = () => {
    const { slug } = useParams();
    const [exam, setExam] = useState(null);
    const [isPurchased, setIsPurchased] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        hours: 24,
        minutes: 59,
        seconds: 59
    });

    useEffect(() => {
        const purchasedCourses = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
        const foundExam = allExams.find(e => e.slug === slug);

        if (foundExam) {
            setExam(foundExam);
            setIsPurchased(purchasedCourses.includes(foundExam.id));
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }

        // Countdown timer
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                } else {
                    clearInterval(timer);
                    return { hours: 0, minutes: 0, seconds: 0 };
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [slug]);

    const handlePurchase = (planId) => {
        const purchasedCourses = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
        purchasedCourses.push(exam.id);
        localStorage.setItem('purchasedCourses', JSON.stringify(purchasedCourses));
        setIsPurchased(true);

        // Show success notification
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    const toggleAccordion = (index) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
                <div className="animate-pulse text-center">
                    <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-4"></div>
                    <div className="text-blue-600 font-medium">Loading exam details...</div>
                </div>
            </div>
        );
    }

    if (!exam) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl font-bold text-gray-700 mb-4">404</div>
                    <p className="text-gray-600 mb-6">Exam not found</p>
                    <Link href="/exams" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Browse All Exams
                    </Link>
                </div>
            </div>
        );
    }

    // Dynamic background based on category
    const getCategoryBackground = () => {
        switch (exam.category) {
            case "Cloud Computing":
                return "bg-[url('/cloud-computing-bg.jpg')]";
            case "Data Science":
                return "bg-[url('/data-science-bg.jpg')]";
            case "Security":
                return "bg-[url('/cybersecurity-bg.jpg')]";
            default:
                return "bg-[url('/tech-pattern.png')]";
        }
    };

    return (
        <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
            {/* Hero Section with Background Image */}
            <div className={`relative text-white py-24 md:py-32 bg-cover bg-center ${getCategoryBackground()}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/90"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl">
                        <div className="flex items-center flex-wrap gap-2 mb-4">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${exam.category === "Cloud Computing" ? "bg-blue-100 text-blue-800" :
                                exam.category === "Data Science" ? "bg-orange-100 text-orange-800" :
                                    exam.category === "Security" ? "bg-red-100 text-red-800" :
                                        "bg-gray-100 text-gray-800"
                                }`}>
                                {exam.category}
                            </span>
                            {isPurchased && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Purchased
                                </span>
                            )}
                            {exam.new && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                                    New & Updated
                                </span>
                            )}
                            {exam.premium && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center">
                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                    Premium
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{exam.title}</h1>
                        <p className="text-xl text-blue-100 mb-6">{exam.description}</p>

                        <div className="flex flex-wrap items-center gap-6 mb-6">
                            <div className="flex items-center text-yellow-300">
                                <Star className="w-6 h-6 fill-current" />
                                <span className="ml-2 font-bold">{exam.rating}</span>
                                <span className="text-blue-200 ml-2">({Math.floor(exam.rating * 1000)} reviews)</span>
                            </div>
                            <div className="flex items-center text-blue-100">
                                <Users className="w-6 h-6" />
                                <span className="ml-2">{exam.students.toLocaleString()}+ students</span>
                            </div>
                            <div className="flex items-center text-blue-100">
                                <Trophy className="w-6 h-6" />
                                <span className="ml-2">{exam.difficulty} level</span>
                            </div>
                            <div className="flex items-center text-blue-100">
                                <Calendar className="w-6 h-6" />
                                <span className="ml-2">Updated {exam.lastUpdated}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            {/* Preview Button */}
                            <button
                                onClick={() => setVideoModalOpen(true)}
                                className="flex items-center bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-lg font-medium transition-all hover:scale-[1.02]"
                            >
                                <Video className="w-5 h-5 mr-2" />
                                Watch course preview
                            </button>

                            {!isPurchased && (
                                <button
                                    onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
                                    className="flex items-center bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white py-3 px-6 rounded-lg font-bold transition-all hover:scale-[1.02] shadow-lg"
                                >
                                    Enroll Now <ArrowRight className="w-5 h-5 ml-2" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Notification */}
            {showNotification && (
                <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center animate-fade-in">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>Successfully enrolled in the course!</span>
                </div>
            )}

            {/* Video Modal */}
            {videoModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full relative">
                        <button
                            onClick={() => setVideoModalOpen(false)}
                            className="absolute -top-3 -right-3 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="aspect-w-16 aspect-h-9 bg-black rounded-t-xl overflow-hidden">
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="text-white text-center p-8">
                                    <Video className="w-12 h-12 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold mb-2">Course Preview</h3>
                                    <p>This would be an embedded video player in a real implementation</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">What you'll learn in this course</h3>
                            <p className="text-gray-600">Get a sneak peek at the course content and teaching style before you enroll.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Certification Benefits Ribbon */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center justify-center gap-6 text-center">
                        <div className="flex items-center">
                            <BadgeCheck className="w-6 h-6 mr-2" />
                            <span>Official Certification Prep</span>
                        </div>
                        <div className="flex items-center">
                            <Percent className="w-6 h-6 mr-2" />
                            <span>94% First Attempt Pass Rate</span>
                        </div>
                        <div className="flex items-center">
                            <TrendingUp className="w-6 h-6 mr-2" />
                            <span>Career Advancement</span>
                        </div>
                        <div className="flex items-center">
                            <Globe className="w-6 h-6 mr-2" />
                            <span>Global Recognition</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 -mt-6 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Content */}
                    <div className="lg:w-2/3">
                        {/* Career Impact Section */}
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl shadow-lg p-6 mb-8">
                            <h2 className="text-2xl font-bold mb-4 flex items-center">
                                <Briefcase className="w-6 h-6 mr-2" />
                                How This Certification Will Boost Your Career
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white/10 p-5 rounded-lg border border-white/20 hover:shadow-md transition-shadow">
                                    <TrendingUp className="w-8 h-8 text-yellow-300 mb-3" />
                                    <h3 className="font-bold text-lg mb-2">Salary Increase</h3>
                                    <p className="text-blue-100">Certified professionals earn 20-40% more on average in this field.</p>
                                </div>
                                <div className="bg-white/10 p-5 rounded-lg border border-white/20 hover:shadow-md transition-shadow">
                                    <Users className="w-8 h-8 text-yellow-300 mb-3" />
                                    <h3 className="font-bold text-lg mb-2">Job Opportunities</h3>
                                    <p className="text-blue-100">Access to exclusive job openings requiring this certification.</p>
                                </div>
                                <div className="bg-white/10 p-5 rounded-lg border border-white/20 hover:shadow-md transition-shadow">
                                    <Globe className="w-8 h-8 text-yellow-300 mb-3" />
                                    <h3 className="font-bold text-lg mb-2">Global Recognition</h3>
                                    <p className="text-blue-100">Recognized by employers worldwide in {exam.category}.</p>
                                </div>
                                <div className="bg-white/10 p-5 rounded-lg border border-white/20 hover:shadow-md transition-shadow">
                                    <Shield className="w-8 h-8 text-yellow-300 mb-3" />
                                    <h3 className="font-bold text-lg mb-2">Credibility</h3>
                                    <p className="text-blue-100">Validate your skills with an industry-recognized credential.</p>
                                </div>
                            </div>
                        </div>

                        {/* Course Highlights */}
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <Zap className="w-6 h-6 text-yellow-500 mr-2" />
                                Why Choose This Course?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                                    <BarChart2 className="w-8 h-8 text-blue-600 mb-3" />
                                    <h3 className="font-bold text-lg mb-2">High Success Rate</h3>
                                    <p className="text-gray-600">94% of our students pass the exam on their first attempt.</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                                    <Users className="w-8 h-8 text-blue-600 mb-3" />
                                    <h3 className="font-bold text-lg mb-2">Expert Instructors</h3>
                                    <p className="text-gray-600">Learn from {exam.instructor.name}, {exam.instructor.role} with {exam.instructor.experience} experience.</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                                    <FileText className="w-8 h-8 text-blue-600 mb-3" />
                                    <h3 className="font-bold text-lg mb-2">Updated Content</h3>
                                    <p className="text-gray-600">Latest exam syllabus updated on {exam.lastUpdated}.</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                                    <BadgeCheck className="w-8 h-8 text-blue-600 mb-3" />
                                    <h3 className="font-bold text-lg mb-2">Practice Exams</h3>
                                    <p className="text-gray-600">{exam.questions} practice questions with detailed explanations.</p>
                                </div>
                            </div>
                        </div>

                        {/* Success Stories Carousel */}
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl shadow-lg p-6 mb-8">
                            <h2 className="text-xl font-bold mb-4 flex items-center">
                                <Trophy className="w-5 h-5 mr-2" />
                                Student Success Stories
                            </h2>
                            <div className="flex overflow-x-auto pb-4 -mx-2">
                                {[1, 2, 3].map((story) => (
                                    <div key={story} className="flex-shrink-0 w-72 bg-white/10 rounded-lg p-4 mx-2">
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 rounded-full bg-white/20 mr-3 flex items-center justify-center text-white font-bold">
                                                {story}
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Student {story}</h4>
                                                <div className="flex items-center text-yellow-300">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className="w-3 h-3 fill-current" />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-blue-100">"Passed the exam on first try thanks to this course. Landed a promotion within 3 months!"</p>
                                        <div className="mt-3 pt-3 border-t border-white/20">
                                            <div className="text-xs text-white/80">Certified on {new Date().toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                            <nav className="flex overflow-x-auto">
                                {['overview', 'syllabus', 'instructor', 'reviews', 'faqs'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </nav>

                            <div className="p-6">
                                {activeTab === 'overview' && (
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-4">About This Certification</h2>
                                        <div className="prose max-w-none text-gray-600">
                                            <p className="text-lg mb-6">{exam.description}</p>

                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
                                                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                                                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                                                    Certification Benefits
                                                </h3>
                                                <ul className="space-y-3">
                                                    <li className="flex items-start">
                                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-700">Official digital badge to showcase on your profiles</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-700">Increased earning potential (20-40% average salary boost)</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-700">Access to exclusive job opportunities</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-700">Global recognition in the {exam.category} field</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">What You'll Learn</h3>
                                            <ul className="space-y-3">
                                                {exam.features.map((feature, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-700">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">Exam Details</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 hover:shadow-sm transition-shadow">
                                                    <div className="text-sm text-blue-600 font-medium">Format</div>
                                                    <div className="font-medium text-gray-800">Multiple choice, multiple response</div>
                                                </div>
                                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 hover:shadow-sm transition-shadow">
                                                    <div className="text-sm text-blue-600 font-medium">Duration</div>
                                                    <div className="font-medium text-gray-800">{exam.duration}</div>
                                                </div>
                                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 hover:shadow-sm transition-shadow">
                                                    <div className="text-sm text-blue-600 font-medium">Questions</div>
                                                    <div className="font-medium text-gray-800">{exam.questions} (practice bank)</div>
                                                </div>
                                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 hover:shadow-sm transition-shadow">
                                                    <div className="text-sm text-blue-600 font-medium">Passing Score</div>
                                                    <div className="font-medium text-gray-800">720/1000 (72%)</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'syllabus' && (
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-6">Course Syllabus</h2>
                                        <div className="space-y-4">
                                            {exam.syllabus.map((week, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                                    <button
                                                        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100"
                                                        onClick={() => toggleAccordion(index)}
                                                    >
                                                        <h3 className="font-medium text-left">Week {week.week}: {week.title}</h3>
                                                        <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${activeAccordion === index ? 'rotate-90' : ''}`} />
                                                    </button>
                                                    {activeAccordion === index && (
                                                        <div className="p-4 border-t border-gray-200">
                                                            <ul className="space-y-2">
                                                                {week.topics.map((topic, i) => (
                                                                    <li key={i} className="flex items-start">
                                                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                                        <span className="text-gray-700">{topic}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                                <h4 className="font-medium text-sm text-gray-500 mb-2">Resources:</h4>
                                                                <div className="flex flex-wrap gap-2">
                                                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">PDF Guide</span>
                                                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">Video Lecture</span>
                                                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">Practice Quiz</span>
                                                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">Hands-on Lab</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'instructor' && (
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-6">About the Instructor</h2>
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-md">
                                                <span className="text-blue-600 text-3xl font-bold">
                                                    {exam.instructor.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900">{exam.instructor.name}</h3>
                                                <p className="text-gray-600 mb-3">{exam.instructor.role} • {exam.instructor.experience} experience</p>
                                                <p className="text-gray-600 mb-4">With over {exam.instructor.students.toLocaleString()} students taught, {exam.instructor.name.split(' ')[0]} brings real-world expertise to help you master the {exam.title} exam.</p>
                                                <div className="flex items-center text-gray-600">
                                                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                                                    <span className="font-medium">4.9</span>
                                                    <span className="mx-1">•</span>
                                                    <span>{Math.floor(exam.instructor.students / 1000)}k+ Reviews</span>
                                                    <span className="mx-1">•</span>
                                                    <span>10+ Industry Certifications</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-6">Student Reviews</h2>
                                        <div className="space-y-6">
                                            {[1, 2, 3].map((review) => (
                                                <div key={review} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                                                    <div className="flex items-center mb-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 mr-3 flex items-center justify-center text-blue-600 font-medium">
                                                            {review}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium">Student {review}</h4>
                                                            <div className="flex items-center">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 mb-2">"This course prepared me perfectly for the exam. The practice questions were very similar to the real thing."</p>
                                                    <div className="text-sm text-gray-500">Completed on {new Date().toLocaleDateString()}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'faqs' && (
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                                        <div className="space-y-4">
                                            {exam.faqs.map((faq, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                                    <h3 className="font-medium text-gray-900 flex items-center">
                                                        <HelpCircle className="w-5 h-5 text-blue-500 mr-2" />
                                                        {faq.question}
                                                    </h3>
                                                    <p className="text-gray-600 mt-2 pl-7">{faq.answer}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:w-1/3" id="pricing">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-6">
                            {isPurchased ? (
                                <>
                                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-lg p-4 mb-6">
                                        <div className="flex items-center text-green-800 mb-2">
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            <span className="font-bold">Full access granted</span>
                                        </div>
                                        <p className="text-sm text-green-700">Expires in 6 months</p>
                                    </div>
                                    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center mb-3 transition-all transform hover:scale-[1.01] shadow-md">
                                        <Download className="w-5 h-5 mr-2" />
                                        Download Study Materials
                                    </button>
                                    <a href={`/exams/${exam.slug}/test`} className="block w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 px-4 rounded-lg font-bold text-center transition-all transform hover:scale-[1.01] shadow-md">
                                        Start Practice Exam
                                    </a>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Certified</h3>
                                    <div className="space-y-4 mb-6">
                                        {exam.plans.map(plan => (
                                            <div
                                                key={plan.id}
                                                className={`border-2 rounded-xl p-5 transition-all ${plan.id === 'premium' || plan.id === 'pro' ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-white shadow-md' : 'border-blue-200 bg-gradient-to-br from-blue-50 to-white'} hover:shadow-lg`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="font-bold text-lg">{plan.name} Plan</div>
                                                        <div className="text-sm text-gray-600">{plan.duration} access</div>
                                                    </div>
                                                    <div className="text-2xl font-bold text-gray-900">${plan.price}</div>
                                                </div>
                                                <ul className="space-y-2 mt-3">
                                                    {plan.features.map((feature, i) => (
                                                        <li key={i} className="flex items-start text-sm">
                                                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                            <span>{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <button
                                                    onClick={() => handlePurchase(plan.id)}
                                                    className={`w-full mt-4 py-3 px-4 rounded-lg font-bold ${plan.id === 'premium' || plan.id === 'pro' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'} transition-all transform hover:scale-[1.01] shadow-md`}
                                                >
                                                    Enroll Now
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                        <h4 className="font-bold text-blue-800 mb-2">What's included:</h4>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-start">
                                                <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span>Full practice question bank</span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span>Detailed explanations</span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span>Performance analytics</span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span>30-day money-back guarantee</span>
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Exam Details Card */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Exam Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Duration</div>
                                        <div className="font-medium text-gray-800">{exam.duration}</div>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                                        <BookOpen className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Questions</div>
                                        <div className="font-medium text-gray-800">{exam.questions} practice questions</div>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                                        <Award className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Difficulty</div>
                                        <div className="font-medium text-gray-800">{exam.difficulty}</div>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                                        <Star className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Rating</div>
                                        <div className="font-medium text-gray-800">{exam.rating}/5 ({Math.floor(exam.rating * 1000)} reviews)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Limited Time Offer */}
                        {!isPurchased && (
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg p-6 mt-6">
                                <h3 className="text-xl font-bold mb-2">Limited Time Offer!</h3>
                                <p className="text-purple-100 mb-4">Enroll today and get access to bonus materials worth $50</p>
                                <div className="flex items-center justify-center bg-white/10 rounded-lg p-3 mb-4">
                                    <div className="text-center">
                                        <div className="text-xs text-purple-200">Offer ends in</div>
                                        <div className="font-bold text-xl">
                                            {timeLeft.hours.toString().padStart(2, '0')}:
                                            {timeLeft.minutes.toString().padStart(2, '0')}:
                                            {timeLeft.seconds.toString().padStart(2, '0')}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handlePurchase(exam.plans[0].id)}
                                    className="w-full bg-white hover:bg-gray-100 text-purple-600 py-3 px-4 rounded-lg font-bold transition-all transform hover:scale-[1.01] shadow-md"
                                >
                                    Claim Offer Now
                                </button>
                            </div>
                        )}

                        {/* Mentor Support Card */}
                        {isPurchased && (
                            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg border border-blue-100 p-6 mt-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Need help?</h3>
                                <p className="text-gray-600 mb-4">Get personalized support from our certified mentors to help you pass your exam.</p>
                                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center transition-all transform hover:scale-[1.01] shadow-md">
                                    <MessageSquare className="w-5 h-5 mr-2" />
                                    Ask a Mentor
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Certification Value Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 border-t border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Get Certified?</h2>
                        <p className="text-gray-600 text-lg">Certifications validate your skills, increase your earning potential, and open doors to new career opportunities.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Higher Salaries</h3>
                            <p className="text-gray-600">Certified professionals earn 20-40% more on average compared to non-certified peers.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Briefcase className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Career Advancement</h3>
                            <p className="text-gray-600">Stand out in job applications and qualify for more senior positions.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Globe className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Global Recognition</h3>
                            <p className="text-gray-600">Industry-recognized credentials valued by employers worldwide.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Badges Section */}
            <div className="bg-gray-50 border-t border-gray-200 py-12">
                <div className="container mx-auto px-4">
                    <h3 className="text-center text-gray-500 text-sm font-medium mb-6">TRUSTED BY PROFESSIONALS AT</h3>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
                        <div className="w-32 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="w-32 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="w-32 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="w-32 h-16 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            {!isPurchased && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to advance your career?</h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Join {exam.students.toLocaleString()}+ professionals who've boosted their careers with this certification.</p>
                        <button
                            onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
                            className="bg-white hover:bg-gray-100 text-blue-600 py-4 px-8 rounded-lg font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
                        >
                            Enroll Now - Start Learning Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamPage;