'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { CheckCircle, Star, Clock, BookOpen, Download, MessageSquare, Award, ChevronRight, Users, Shield, Trophy, Zap, BarChart2, BadgeCheck, Video, FileText, HelpCircle, ArrowRight, Percent, Calendar, Globe, Briefcase, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';

const ExamPage = () => {
    const { slug } = useParams();
    const { user } = useUser();
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
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });


    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/slug/${slug}/`);
                if (response.ok) {
                    const data = await response.json();
                    setExam(data.data);

                    if (user) {
                        const enrollmentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enrollments/check/?user_id=${user._id}&course_slug=${slug}`);
                        if (enrollmentResponse.ok) {
                            const enrollmentData = await enrollmentResponse.json();
                            setIsPurchased(enrollmentData.is_enrolled);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching course details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseDetails();

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                else if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                else if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                else {
                    clearInterval(timer);
                    return { hours: 0, minutes: 0, seconds: 0 };
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [slug, user]);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        if (user && exam?.id) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/check-purchase/${exam.id}/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.isPurchased) setIsPurchased(true);
                })
                .catch((err) => console.error(err));
        }
    }, [user, exam]);

    useEffect(() => {
        if (exam?.id) {
            fetchReviews();
        }
    }, [exam]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${exam.id}/`);
            const data = await res.json();
            console.log("data.reviews", data.reviews)
            if (res.ok) {
                if (data.success) {
                    setReviews(data.reviews);
                }
            }
        } catch (err) {
            console.error("Error fetching reviews:", err);
        }
    };

    const handleReviewSubmit = async () => {
        if (!user) {
            toast.error("Please log in to submit a review.");
            return;
        }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${exam.id}/add/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(newReview)
            });
            const data = await res.json();
            if (data.success) {
                // Create an optimistic review object
                const newReviewObj = {
                    user: {
                        name: user.name,
                        email: user.email
                    },
                    rating: newReview.rating,
                    comment: newReview.comment,
                    createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
                };

                // Instant UI update
                setReviews(prev => [newReviewObj, ...prev]);

                // Clear input fields
                setNewReview({ rating: 5, comment: '' });

                // Sync with server data in the background
                fetchReviews();
                toast.success("Review submitted successfully")
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error("Error submitting review:", err);
        }
    };


    const handlePurchase = async (planId) => {
        if (!user) {
            toast.error("Please log in to continue");
            return;
        }
        console.log("course_id : ", exam.id);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-order/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    course_id: exam.id,
                }),
            });

            const orderData = await res.json();
            if (!orderData.success) {
                toast.error(orderData.message);
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Exam Questions",
                description: exam.title,
                order_id: orderData.order_id,
                handler: async function (response) {
                        const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/verify/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                        body: JSON.stringify({
                            payment_id: orderData.payment_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    });

                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        setIsPurchased(true);
                        setShowNotification(true);
                        setTimeout(() => setShowNotification(false), 3000);
                    } else {
                        toast.error("Payment verification failed");
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            toast.success("payment successful")
        } catch (err) {
            console.error(err);
            toast.error("Payment could not be started");
        }
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

    // For demo purposes, we'll create mock plans based on course price
    const mockPlans = [
        {
            id: 'basic',
            name: 'Basic',
            duration: '3 months',
            price: exam.price, // 20% discount
            features: [
                'Full course access',
                'Practice questions',
                'Progress tracking'
            ]
        },

    ];

    // For demo purposes, we'll create mock syllabus if not available
    const mockSyllabus = exam.syllabus && exam.syllabus.length > 0 ? exam.syllabus : [
        {
            week: 1,
            title: 'Introduction to ' + exam.title,
            topics: [
                'Course overview',
                'Exam structure',
                'Study techniques',
                'Resource materials'
            ]
        },
        {
            week: 2,
            title: 'Core Concepts',
            topics: [
                'Fundamental principles',
                'Key terminology',
                'Basic configurations'
            ]
        },
        {
            week: 3,
            title: 'Advanced Topics',
            topics: [
                'Complex scenarios',
                'Troubleshooting',
                'Best practices'
            ]
        },
        {
            week: 4,
            title: 'Exam Preparation',
            topics: [
                'Practice tests',
                'Time management',
                'Test-taking strategies'
            ]
        }
    ];

    // For demo purposes, we'll create mock FAQs if not available
    const mockFaqs = exam.faqs && exam.faqs.length > 0 ? exam.faqs : [
        {
            question: 'How long do I have access to the course?',
            answer: 'Access duration depends on the plan you choose (3 months, 6 months, or 1 year).'
        },
        {
            question: 'Is there a money-back guarantee?',
            answer: 'Yes, we offer a 30-day money-back guarantee if you\'re not satisfied with the course.'
        },
        {
            question: 'How often is the course content updated?',
            answer: 'We update our content regularly to reflect the latest exam changes and industry trends.'
        },
        {
            question: 'Do I need any prerequisites for this course?',
            answer: 'Basic knowledge of the subject is recommended but not required as we cover fundamentals.'
        }
    ];

    // For demo purposes, we'll create mock instructor data
    console.log(reviews)

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
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{exam.title}</h1>
                        <p className="text-xl text-blue-100 mb-6">{exam.description}</p>

                        <div className="flex flex-wrap items-center gap-6 mb-6">
                            <div className="flex items-center text-yellow-300">
                                <Star className="w-6 h-6 fill-current" />
                                <span className="ml-2 font-bold">{exam.avgRating?.toFixed(1) || '4.8'}</span>
                                <span className="text-blue-200 ml-2">({exam.ratingCount || '1000'} reviews)</span>
                            </div>
                            <div className="flex items-center text-blue-100">
                                <Users className="w-6 h-6" />
                                <span className="ml-2">{exam.enrolled_count?.toLocaleString() || '5000'}+ students</span>
                            </div>
                            <div className="flex items-center text-blue-100">
                                <Calendar className="w-6 h-6" />
                                <span className="ml-2">Updated {exam.lastUpdated || 'recently'}</span>
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
                            <h3 className="text-xl font-bold mb-2">What you will learn in this course</h3>
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
                                        <p className="text-sm text-blue-100">&quot;Passed the exam on first try thanks to this course. Landed a promotion within 3 months!&quot;</p>
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
                                {['overview', 'syllabus', 'reviews', 'faqs'].map((tab) => (
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

                                            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">What You will Learn</h3>
                                            <ul className="space-y-3">
                                                {(exam.features || ['Comprehensive exam preparation', 'Real-world scenarios', 'Hands-on practice', 'Exam strategies']).map((feature, index) => (
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
                                                    <div className="font-medium text-gray-800">{exam.duration || '2 hours'}</div>
                                                </div>
                                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 hover:shadow-sm transition-shadow">
                                                    <div className="text-sm text-blue-600 font-medium">Questions</div>
                                                    <div className="font-medium text-gray-800">{exam.questions || '500+'} (practice bank)</div>
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
                                            {mockSyllabus.map((week, index) => (
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



                                {activeTab === 'reviews' && (
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-6">Student Reviews</h2>
                                        <div className="space-y-6">
                                            {user && (
                                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                                        <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
                                                        Share Your Experience
                                                    </h3>

                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Your Rating
                                                        </label>
                                                        <div className="flex items-center space-x-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button
                                                                    key={star}
                                                                    type="button"
                                                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                                                    className={`w-8 h-8 ${newReview.rating >= star
                                                                        ? 'text-yellow-400'
                                                                        : 'text-gray-300'}`}
                                                                >
                                                                    <Star
                                                                        className="w-full h-full"
                                                                        fill={newReview.rating >= star ? 'currentColor' : 'none'}
                                                                        stroke="currentColor"
                                                                        strokeWidth={1.5}
                                                                    />
                                                                </button>
                                                            ))}
                                                            <span className="ml-2 text-sm text-gray-600">
                                                                {newReview.rating} {newReview.rating === 1 ? 'star' : 'stars'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="mb-4">
                                                        <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-2">
                                                            Your Review
                                                        </label>
                                                        <textarea
                                                            id="review-text"
                                                            value={newReview.comment}
                                                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                            placeholder="Share your thoughts about this course..."
                                                            rows="4"
                                                        />
                                                    </div>

                                                    <button
                                                        onClick={handleReviewSubmit}
                                                        disabled={!newReview.comment.trim()}
                                                        className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${!newReview.comment.trim()
                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transform hover:scale-[1.01]'}`}
                                                    >
                                                        Submit Review
                                                    </button>

                                                    <p className="text-xs text-gray-500 mt-3">
                                                        Your review will help other students make informed decisions.
                                                    </p>
                                                </div>
                                            )}

                                            <div className="space-y-6">
                                                {reviews.map((review, index) => (
                                                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                                                        <div className="flex items-center mb-3">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 mr-3 flex items-center justify-center text-blue-600 font-medium">
                                                                {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium">{review.user.name}</h4>
                                                                <div className="flex items-center">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-600 mb-2">{review.comment}</p>
                                                        <div className="text-sm text-gray-500">Reviewed on {review.createdAt}</div>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    </div>
                                )}

                                {activeTab === 'faqs' && (
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                                        <div className="space-y-4">
                                            {mockFaqs.map((faq, index) => (
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
                        {/* Main Pricing Card */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-6">
                            {isPurchased ? (
                                // Purchased State
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

                                    <a
                                        href={`/exams/${exam.slug}/test`}
                                        className="block w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 px-4 rounded-lg font-bold text-center transition-all transform hover:scale-[1.01] shadow-md"
                                    >
                                        Start Practice Exam
                                    </a>
                                </>
                            ) : (
                                // Not Purchased State
                                <>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Certified</h3>

                                    {/* Pricing Plans */}
                                    <div className="space-y-4 mb-6">
                                        {mockPlans.map(plan => (
                                            <div
                                                key={plan.id}
                                                className={`border-2 rounded-xl p-5 transition-all ${plan.id === 'premium' || plan.id === 'pro'
                                                    ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-white shadow-md'
                                                    : 'border-blue-200 bg-gradient-to-br from-blue-50 to-white'
                                                    } hover:shadow-lg`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="font-bold text-lg">{plan.name} Plan</div>
                                                        <div className="text-sm text-gray-600">{plan.duration} access</div>
                                                    </div>
                                                    <div className="text-2xl font-bold text-gray-900">RS. {plan.price}</div>
                                                </div>

                                                <ul className="space-y-2 mt-3">
                                                    {plan.features.map((feature, i) => (
                                                        <li key={i} className="flex items-start text-sm">
                                                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                            <span className="text-gray-700">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <button
                                                    onClick={() => handlePurchase(mockPlans[0].id)}
                                                    className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-all ${plan.id === 'premium' || plan.id === 'pro'
                                                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white'
                                                        : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                                                        } shadow-sm hover:shadow-md`}
                                                >
                                                    Enroll Now
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Limited Time Offer */}
                                    {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center text-blue-800 mb-2">
            <Clock className="w-5 h-5 mr-2" />
            <span className="font-bold">Limited Time Offer</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700">Ends in:</span>
            <div className="flex items-center space-x-1 font-mono">
              <span className="bg-gray-800 text-white px-2 py-1 rounded text-sm">
                {timeLeft.hours.toString().padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-gray-800 text-white px-2 py-1 rounded text-sm">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-gray-800 text-white px-2 py-1 rounded text-sm">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600">Get 20% off on all plans today!</p>
        </div> */}

                                    {/* Money Back Guarantee */}
                                    <div className="flex items-start border border-green-200 bg-green-50 rounded-lg p-4">
                                        <Shield className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-medium text-green-800 mb-1">30-Day Money-Back Guarantee</h4>
                                            <p className="text-sm text-green-700">
                                                If you are not satisfied, we will refund your payment. No questions asked.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Resources Card */}
                        {/* <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-6">
    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
      <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
      Free Resources
    </h3>
    <ul className="space-y-3">
      <li className="flex items-center p-3 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
        <FileText className="w-5 h-5 text-blue-600 mr-3" />
        <span className="font-medium">Exam Blueprint PDF</span>
      </li>
      <li className="flex items-center p-3 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
        <Video className="w-5 h-5 text-blue-600 mr-3" />
        <span className="font-medium">Study Tips Video</span>
      </li>
      <li className="flex items-center p-3 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
        <MessageSquare className="w-5 h-5 text-blue-600 mr-3" />
        <span className="font-medium">Community Forum Access</span>
      </li>
      <li className="flex items-center p-3 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
        <Download className="w-5 h-5 text-blue-600 mr-3" />
        <span className="font-medium">Practice Question Samples</span>
      </li>
    </ul>
  </div> */}

                        {/* Exam Details Card */}
                        {/* <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-6">
    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
      <Award className="w-5 h-5 text-blue-600 mr-2" />
      Exam Details
    </h3>
    <div className="space-y-4">
      <div className="flex items-start">
        <Clock className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-gray-900">Duration</h4>
          <p className="text-sm text-gray-600">{exam.duration || '2 hours'}</p>
        </div>
      </div>
      <div className="flex items-start">
        <FileText className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-gray-900">Format</h4>
          <p className="text-sm text-gray-600">Multiple choice, drag & drop, simulations</p>
        </div>
      </div>
      <div className="flex items-start">
        <Percent className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-gray-900">Passing Score</h4>
          <p className="text-sm text-gray-600">720/1000 (72%)</p>
        </div>
      </div>
      <div className="flex items-start">
        <Calendar className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-gray-900">Scheduling</h4>
          <p className="text-sm text-gray-600">On-demand at testing centers</p>
        </div>
      </div>
    </div>
  </div> */}
                    </div>
                </div>
            </div>

            {/* Related Courses Section */}
            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">More Certifications You Might Like</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((course) => (
                            <div key={course} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="h-40 bg-gradient-to-r from-blue-100 to-indigo-100"></div>
                                <div className="p-5">
                                    <div className="flex items-center mb-2">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                            {exam.category}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Related Certification {course}</h3>
                                    <p className="text-gray-600 text-sm mb-4">Short description of this related certification course.</p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-gray-900">${exam.price + course * 50}</span>
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                            View Details <ArrowRight className="w-4 h-4 inline ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Career?</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Join thousands of professionals who have advanced their careers with this certification.</p>
                    {!isPurchased ? (
                        <button
                            onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all transform hover:scale-[1.02] inline-flex items-center"
                        >
                            Enroll Now <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    ) : (
                        <Link
                            href={`/exams/${exam.slug}/test`}
                            className="bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all transform hover:scale-[1.02] inline-flex items-center"
                        >
                            Start Learning <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamPage;
