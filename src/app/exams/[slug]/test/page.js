'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Clock, CheckCircle, XCircle, AlertTriangle, ArrowLeft, Save, Send } from 'lucide-react';
import Link from 'next/link';

export default function AutomatedExamPage() {
  const { slug } = useParams();
  const { user } = useUser();
  // console.log("user", user)
  const router = useRouter();

  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [examCompleted, setExamCompleted] = useState(false);
  const [examResults, setExamResults] = useState(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [autoSaveInterval, setAutoSaveInterval] = useState(null);

  // Initialize exam
  useEffect(() => {
    if (!user || examStarted) return; // stop if already started
    router.prefetch(`/exams/${slug}`); // optional, keeps navigation fast
    startExam();
    
  }, [user, slug]);

  // Timer effect
  useEffect(() => {
    if (!examStarted || examCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time&apos;s up - auto submit
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, examCompleted]);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    if (!examStarted || examCompleted) return;

    const interval = setInterval(() => {
      saveProgress();
    }, 30000);

    setAutoSaveInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [examStarted, examCompleted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }
    };
  }, [autoSaveInterval]);

  const startExam = async () => {
    try {
      setLoading(true);
      
      // First get the course details to get the course ID
      const courseResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/slug/${slug}/`);
      if (!courseResponse.ok) {
        throw new Error('Failed to fetch course details');
      }
      const courseData = await courseResponse.json();
      const courseId = courseData.data.id;
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams/practice/${courseId}/start/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log("data", data)
      
      if (data.success) {
        setExamData(data);
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill({ answer: null, timestamp: null }));
        setTimeRemaining(data.duration * 60); // Convert to seconds
        setExamStarted(true);
        setLoading(false);
      } else {
        alert(data.message || 'Failed to start exam');
        router.push(`/exams/${slug}`);
      }
    } catch (error) {
      console.error('Error starting exam:', error);
      alert('Failed to start exam. Please try again.');
      router.push(`/exams/${slug}`);
    }
  };

  const saveProgress = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams/save-progress/${examData.test_attempt_id}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleTimeUp = async () => {
    setShowTimeUp(true);
    setExamCompleted(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams/auto-submit/${examData.test_attempt_id}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setExamResults(data);
      }
    } catch (error) {
      console.error('Error auto-submitting exam:', error);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = {
      answer: answer,
      timestamp: new Date().toISOString()
    };
    setAnswers(newAnswers);
  };

  const handleSubmitExam = async () => {
    if (!showConfirmSubmit) {
      setShowConfirmSubmit(true);
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exams/submit/${examData.test_attempt_id}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();
      console.log("submitted data", data)
      
      if (data.success) {
        setExamResults(data);
        setExamCompleted(true);
        setShowConfirmSubmit(false);
      } else {
        alert(data.message || 'Failed to submit exam');
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Failed to submit exam. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining <= 300) return 'text-red-600'; // Last 5 minutes
    if (timeRemaining <= 600) return 'text-yellow-600'; // Last 10 minutes
    return 'text-green-600';
  };

  const getProgressPercentage = () => {
    const answered = answers.filter(a => a.answer !== null).length;
    return (answered / questions.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Starting your exam...</p>
        </div>
      </div>
    );
  }
  if (examCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Summary Card (Top Right) */}
        <div className="flex justify-center mb-12">
  <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transform transition-all hover:shadow-2xl hover:scale-[1.01]">
    {/* Ribbon for passed/failed status */}
    {examResults?.passed ? (
      <div className="absolute top-0 right-6 bg-green-500 text-white text-sm font-bold px-4 py-1 rounded-b-lg shadow-md flex items-center">
        <CheckCircle className="w-4 h-4 mr-1" /> PASSED WITH FLYING COLORS!
      </div>
    ) : (
      <div className="absolute top-0 right-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-sm font-bold px-4 py-1 rounded-b-lg shadow-md flex items-center">
        <AlertTriangle className="w-4 h-4 mr-1" /> KEEP PRACTICING!
      </div>
    )}

    <div className="text-center mb-6">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
        {examResults?.passed ? "Fantastic Work!" : "Great Effort!"}
      </h2>
      <p className="text-gray-600">
        {examResults?.passed
          ? "You've demonstrated excellent understanding!"
          : "Every attempt brings you closer to mastery!"}
      </p>
    </div>

    {/* Animated Progress Circle */}
    <div className="flex items-center justify-center mb-6">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={examResults?.passed ? "#10b981" : "#f59e0b"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(examResults?.percentage || 0) * 2.83} 283`}
            transform="rotate(-90 50 50)"
            className="animate-progress"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {examResults?.percentage?.toFixed(1) || 0}%
          </span>
          <span className="text-sm text-gray-500 mt-1">Overall Score</span>
          {examResults?.passed ? (
  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mt-2">
    🎉 {examResults?.percentage - (examResults?.passing_percentage || 60)}% above passing
  </span>
) : (
  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mt-2">
    ⚡ {((examResults?.passing_percentage || 60) - examResults?.percentage)}% more needed to pass
  </span>
)}

        </div>
      </div>
    </div>

    {/* Stats with icons */}
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-blue-600">Score</p>
            <p className="text-xl font-bold text-gray-900">
              {examResults?.score || 0}/{examResults?.total_marks || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
        <div className="flex items-center">
          <div className="bg-purple-100 p-2 rounded-lg mr-3">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-purple-600">Time Taken</p>
            <p className="text-xl font-bold text-gray-900">
              {examResults?.duration_taken || 0} mins
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Motivational Message */}
    <div className={`p-4 rounded-xl ${examResults?.passed ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
      <div className="flex items-start">
        {examResults?.passed ? (
          <>
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-green-800">Achievement Unlocked!</h3>
              <p className="text-sm text-green-700 mt-1">
            {examResults?.percentage < 60 
              ? `You need ${60 - examResults?.percentage}% more to reach the passing mark.` 
              : `🎉 Congratulations! You scored ${examResults?.percentage - 60}% above the passing mark!`}
          </p>

            </div>
          </>
        ) : (
          <>
            <div className="bg-yellow-100 p-2 rounded-lg mr-3">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-yellow-800">You are Almost There!</h3>
              <p className="text-sm text-green-700 mt-1">
  {examResults?.percentage < 60 
    ? `You need ${60 - examResults?.percentage}% more to reach the passing mark.` 
    : `🎉 Congratulations! You scored ${examResults?.percentage - 60}% above the passing mark!`}
</p>

            </div>
          </>
        )}
      </div>
    </div>

    {/* Confidence Meter (Only show if passed) */}
    {examResults?.passed && (
      <div className="mt-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Your Confidence Level</span>
          <span className="text-sm font-bold text-blue-600">
            {examResults?.percentage > 85 ? 'EXPERT' : 
             examResults?.percentage > 70 ? 'ADVANCED' : 'COMPETENT'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${Math.min(100, (examResults?.percentage || 0) + 15)}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {examResults?.percentage > 85 ? 'You show expert-level understanding!' : 
           examResults?.percentage > 70 ? 'You have advanced knowledge!' : 'You demonstrate solid competence!'}
        </p>
      </div>
    )}
  </div>
</div>
  
          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Questions Review Section (Left Side) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 bg-gray-50 border-b">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <svg
                      className="w-6 h-6 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Detailed Review
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Review your answers and learn from mistakes
                  </p>
                </div>
  
                <div className="divide-y divide-gray-200">
                  {examResults?.analysis?.map((item, index) => (
                    <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start">
                        <div className="mr-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              item.is_correct ? 'bg-green-100' : 'bg-red-100'
                            }`}
                          >
                            {item.is_correct ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">
                            Q{index + 1}: {item.question_text}
                          </h3>
                          <div className="mt-3 space-y-2">
                            {item.options.map((opt, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-lg border ${
                                  item.correct_answers.includes(idx)
  ? 'bg-green-50 border-green-200'
  : (
      item.user_answer === idx || 
      (Array.isArray(item.user_answer) && item.user_answer.includes(idx))
    )
    ? 'bg-red-50 border-red-200'
    : 'bg-gray-50 border-gray-200'
                                }`}
                              >
                                <div className="flex items-center">
                                  <span
                                    className={`inline-block w-5 h-5 rounded mr-3 flex items-center justify-center ${
                                      item.correct_answers.includes(idx)
  ? 'bg-green-100 text-green-800'
  : (
      item.user_answer === idx || 
      (Array.isArray(item.user_answer) && item.user_answer.includes(idx))
    )
    ? 'bg-red-100 text-red-800'
    : 'bg-gray-100 text-gray-800'

                                    }`}
                                  >
                                    {String.fromCharCode(65 + idx)}
                                  </span>
                                  <span>{opt}</span>
                                </div>
                              </div>
                            ))}
                          </div>
  
                          {!item.is_correct && (
                            <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-medium text-blue-800 flex items-center">
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                Explanation
                              </h4>
                              <p className="mt-1 text-blue-700">
                                {item.explanation || 'No explanation available.'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
  
            {/* Motivational Section (Right Side) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {examResults?.passed ? 'Great Job!' : 'Keep Practicing!'}
                </h3>
                <div className="flex items-center mb-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="px-3 text-gray-500">Next Steps</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
  
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                      <svg
                        className="w-5 h-5 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Take Another Test</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Reinforce your knowledge with more practice
                      </p>
                    </div>
                  </div>
  
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Review Weak Areas</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Focus on questions you got wrong
                      </p>
                    </div>
                  </div>
  
                  {!examResults?.passed && (
                    <div className="flex items-start">
                      <div className="bg-red-100 p-2 rounded-lg mr-3">
                        <svg
                          className="w-5 h-5 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Need Help?</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Consider reviewing the course material again
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
  
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-3">
                  {examResults?.passed
                    ? 'Ready for the next challenge?'
                    : 'You can do better next time!'}
                </h3>
                <p className="mb-5 opacity-90">
                  {examResults?.passed
                    ? 'Your performance shows you understand the material well. Keep up the good work!'
                    : 'Practice makes perfect. Try again to improve your score.'}
                </p>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-opacity-90 transition-all transform hover:scale-105"
                  >
                    Take Another Practice Test
                  </button>
                  <Link
                    href={`/exams/${slug}`}
                    className="px-6 py-3 bg-transparent border-2 border-white rounded-lg font-medium text-center hover:bg-white hover:bg-opacity-20 transition-colors"
                  >
                    Back to Course
                  </Link>
                </div>
              </div>
  
              {examResults?.passed && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-center mb-3">
                    <svg
                      className="w-6 h-6 text-yellow-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                    <h3 className="font-bold text-yellow-800">Achievement Unlocked!</h3>
                  </div>
                  <p className="text-yellow-700">
                    You have completed this practice test with a passing score. Consider
                    taking the final exam to certify your knowledge.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showTimeUp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4 text-center">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-4">Time&apos;s Up!</h1>
          <p className="text-gray-600 mb-6">Your exam has been automatically submitted.</p>
          <button
            onClick={() => setShowTimeUp(false)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Timer */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href={`/exams/${slug}`}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Practice Exam</h1>
                <p className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Progress Bar */}
              <div className="hidden md:block">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{Math.round(getProgressPercentage())}%</span>
                </div>
              </div>

              {/* Timer */}
              <div className={`flex items-center space-x-2 ${getTimeColor()}`}>
                <Clock className="w-5 h-5" />
                <span className="text-xl font-mono font-bold">
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={saveProgress}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </button>
                <button
                  onClick={handleSubmitExam}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Question Navigator</h3>
              <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      currentQuestion === index
                        ? 'bg-blue-600 text-white'
                        : answers[index]?.answer !== null
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Answered:</span>
                  <span className="font-semibold text-green-600">
                    {answers.filter(a => a.answer !== null).length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-semibold text-gray-600">
                    {questions.length - answers.filter(a => a.answer !== null).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8">
              {questions[currentQuestion] && (
                <div>
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        Question {currentQuestion + 1}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                        {questions[currentQuestion].question_type}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                        {questions[currentQuestion].marks} mark{questions[currentQuestion].marks > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {questions[currentQuestion].question_text}
                    </h2>
                  </div>

                  {/* Answer Options */}
                  <div className="space-y-4 mb-8">
                    {questions[currentQuestion].options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                          questions[currentQuestion].question_type === 'MCQ'
                            ? answers[currentQuestion]?.answer?.includes(optionIndex)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200'
                            : answers[currentQuestion]?.answer === optionIndex
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <input
                          type={questions[currentQuestion].question_type === 'MCQ' ? 'checkbox' : 'radio'}
                          name={`question-${currentQuestion}`}
                          value={optionIndex}
                          checked={
                            questions[currentQuestion].question_type === 'MCQ'
                              ? answers[currentQuestion]?.answer?.includes(optionIndex) || false
                              : answers[currentQuestion]?.answer === optionIndex
                          }
                          onChange={(e) => {
                            if (questions[currentQuestion].question_type === 'MCQ') {
                              const currentAnswers = answers[currentQuestion]?.answer || [];
                              let newAnswers;
                              if (e.target.checked) {
                                newAnswers = [...currentAnswers, optionIndex];
                              } else {
                                newAnswers = currentAnswers.filter(a => a !== optionIndex);
                              }
                              handleAnswerChange(currentQuestion, newAnswers);
                            } else {
                              handleAnswerChange(currentQuestion, optionIndex);
                            }
                          }}
                          className="mt-1 mr-3"
                        />
                        <span className="text-gray-900">{option}</span>
                      </label>
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                      disabled={currentQuestion === 0}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={saveProgress}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Save Progress
                      </button>
                      
                      {currentQuestion === questions.length - 1 ? (
                        <button
                          onClick={handleSubmitExam}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Submit Exam
                        </button>
                      ) : (
                        <button
                          onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Confirm Submission</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your exam? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitExam}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
