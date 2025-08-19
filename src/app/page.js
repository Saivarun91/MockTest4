// src/app/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star, Clock, Zap, Award, CheckCircle, BarChart2, Users, BookOpen, Trophy, TrendingUp, Heart, Bookmark, Share2 } from 'lucide-react';
import { useUser } from '@/context/UserContext';

export default function Home() {
    const { courses } = useUser();
    
    // State for animated counter
    const [counters, setCounters] = useState({
        students: 0,
        questions: 0,
        passRate: 0,
        exams: 0,
        activeUsers: 0
    });

    // State for popularity metrics
    const [popularityMetrics, setPopularityMetrics] = useState({
        viewsToday: 0,
        examsStarted: 0,
        questionsAnswered: 0
    });

    // Animate counters on load
    useEffect(() => {
        const targetValues = {
            students: 12543,
            questions: 10200,
            passRate: 95,
            exams: 58,
            activeUsers: 843
        };

        const popularityTargets = {
            viewsToday: 342,
            examsStarted: 128,
            questionsAnswered: 2457
        };

        const duration = 2000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            setCounters({
                students: Math.floor(progress * targetValues.students),
                questions: Math.floor(progress * targetValues.questions),
                passRate: Math.floor(progress * targetValues.passRate),
                exams: Math.floor(progress * targetValues.exams),
                activeUsers: Math.floor(progress * targetValues.activeUsers)
            });

            if (progress > 0.5) {
                const popProgress = (progress - 0.5) * 2;
                setPopularityMetrics({
                    viewsToday: Math.floor(popProgress * popularityTargets.viewsToday),
                    examsStarted: Math.floor(popProgress * popularityTargets.examsStarted),
                    questionsAnswered: Math.floor(popProgress * popularityTargets.questionsAnswered)
                });
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();

        const interval = setInterval(() => {
            setPopularityMetrics(prev => ({
                viewsToday: prev.viewsToday + Math.floor(Math.random() * 3),
                examsStarted: prev.examsStarted + Math.floor(Math.random() * 2),
                questionsAnswered: prev.questionsAnswered + Math.floor(Math.random() * 10)
            }));
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    // Group courses by category
    const coursesByCategory = courses.reduce((acc, course) => {
        if (!acc[course.category]) {
            acc[course.category] = [];
        }
        acc[course.category].push(course);
        return acc;
    }, {});

    // Get featured courses (first 3 courses)
    const featuredCourses = courses.slice(0, 3);

  // Features with icons
  const features = [
    {
      title: "AI-Powered Practice",
      description: "Smart algorithms adapt to your weaknesses and focus on areas needing improvement",
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      bg: "bg-blue-50",
      stats: "Improves retention by 72%"
    },
    {
      title: "Real Exam Simulation",
      description: "Timed tests with the same format and difficulty as the real certification",
      icon: <Clock className="w-8 h-8 text-purple-600" />,
      bg: "bg-purple-50",
      stats: "95% exam similarity score"
    },
    {
      title: "Detailed Explanations",
      description: "Understand concepts, not just answers with comprehensive explanations",
      icon: <BarChart2 className="w-8 h-8 text-green-600" />,
      bg: "bg-green-50",
      stats: "Average 4.9/5 rating"
    },
    {
      title: "Certification Guarantee",
      description: "Free extension if you don't pass after completing our program",
      icon: <Award className="w-8 h-8 text-orange-600" />,
      bg: "bg-orange-50",
      stats: "92% first-time pass rate"
    }
  ];

  // Testimonials with enhanced data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "AWS Certified",
      rating: 5,
      comment: "I passed my AWS exam on the first try thanks to the realistic practice tests. The platform identified my weak areas and helped me improve.",
      exam: "AWS Solutions Architect",
      before: "62%",
      after: "92%",
      avatar: "/avatars/1.jpg",
      studyTime: "3 weeks",
      improvement: "30% increase",
      salaryIncrease: "$15,000"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "PMP Certified",
      rating: 5,
      comment: "The AI-powered study plan saved me 30+ hours of study time by focusing exactly on what I needed to learn.",
      exam: "Project Management Professional",
      before: "58%",
      after: "89%",
      avatar: "/avatars/2.jpg",
      studyTime: "4 weeks",
      improvement: "31% increase",
      salaryIncrease: "$12,000"
    },
    {
      id: 3,
      name: "David Wilson",
      role: "CISSP Certified",
      rating: 5,
      comment: "After failing twice with other resources, I passed with 90% using this platform's targeted practice system.",
      exam: "Certified Information Systems Security Professional",
      before: "54%",
      after: "90%",
      avatar: "/avatars/3.jpg",
      studyTime: "6 weeks",
      improvement: "36% increase",
      salaryIncrease: "$18,000"
    }
  ];

  // Carousel state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToTestimonial = (index) => {
    setIsAutoPlaying(false);
    setCurrentTestimonial(index);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Video Background */}
      <section className="relative bg-black text-white pt-24 pb-32 h-[90vh] min-h-[600px] flex items-center">
        {/* Video background */}
        <div className="absolute inset-0 z-0 opacity-70">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-6 border border-white/30 animate-pulse">
              <Zap className="w-4 h-4 mr-2" />
              <span>Trusted by {counters.students.toLocaleString()}+ students worldwide</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-400 animate-text-shimmer">Certify Your Future</span><br />
              Land Your Dream Job Faster
            </h1>

            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
              The most effective exam prep platform with AI-powered practice tests and personalized study plans.
            </p>

            {/* Real-time activity indicator */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-8 inline-flex items-center text-sm border border-white/20">
              <div className="flex items-center mr-4">
                <Users className="w-4 h-4 mr-1" />
                <span>{counters.activeUsers}+ active now</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>{popularityMetrics.viewsToday} exploring today</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 group">
                <Zap className="w-5 h-5 group-hover:animate-bounce" />
                Start Free Trial
              </Link>
              <Link href="/exams" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg shadow-lg border border-white/20 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Browse Exams
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Exam Cards */}
      <div className="container mx-auto px-4 relative -mt-16 z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">{course.category}</span>
                  {course.new && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">NEW</span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">{course.title}</h3>

                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{course.duration} • {course.questions} Questions</span>
                </div>

                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(course.avgRating) ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {course.avgRating} ({course.ratingCount} reviews)
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${course.popularity}%` }}
                  ></div>
                </div>

                <Link
                  href={`/exams/${course.slug}`}
                  className="block w-full text-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Start Practicing Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section with Background */}
      <section className="py-16 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-fixed bg-center relative">
        <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by Learners Worldwide</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">Join our growing community of certification achievers</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:shadow-lg transition-all text-white">
              <div className="text-4xl font-bold mb-2 animate-count">{counters.students.toLocaleString()}+</div>
              <div className="font-medium text-blue-100">Students Empowered</div>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:shadow-lg transition-all text-white">
              <div className="text-4xl font-bold mb-2 animate-count">{counters.questions.toLocaleString()}+</div>
              <div className="font-medium text-blue-100">Practice Questions</div>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:shadow-lg transition-all text-white">
              <div className="text-4xl font-bold mb-2 animate-count">{counters.passRate}%</div>
              <div className="font-medium text-blue-100">First-Time Pass Rate</div>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:shadow-lg transition-all text-white">
              <div className="text-4xl font-bold mb-2 animate-count">{counters.exams}+</div>
              <div className="font-medium text-blue-100">Certification Exams</div>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:shadow-lg transition-all text-white">
              <div className="text-4xl font-bold mb-2 animate-count">{popularityMetrics.questionsAnswered.toLocaleString()}+</div>
              <div className="font-medium text-blue-100">Questions Answered Today</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Smartest Way to Certify</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our platform adapts to your learning style for maximum efficiency</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className={`p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 ${feature.bg}`}>
                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 mb-3">{feature.description}</p>
                <div className="text-sm font-medium text-gray-500 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {feature.stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses by Category Section */}
      {/* Courses by Category Section - Simplified and Attractive */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Certification Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Find the perfect certification path for your career goals</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Object.keys(coursesByCategory).map((category) => {
              const categoryCourses = coursesByCategory[category];
              const courseCount = categoryCourses.length;
              const mostPopularCourse = [...categoryCourses].sort((a, b) => b.popularity - a.popularity)[0];

              return (
                <Link
                  key={category}
                  href={`/courses/${encodeURIComponent(category)}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all h-full flex flex-col">
                    <div className="p-6 flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {courseCount} {courseCount === 1 ? 'Course' : 'Courses'}
                        </span>
                        {categoryCourses.some(course => course.new) && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">NEW</span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {category}
                      </h3>

                      {mostPopularCourse && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-500 mb-1">Most Popular:</p>
                          <p className="text-sm font-medium text-gray-700 line-clamp-2">
                            {mostPopularCourse.title}
                          </p>
                          <div className="flex items-center mt-2">
                            <div className="flex text-yellow-400 mr-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${i < Math.floor(mostPopularCourse.avgRating) ? 'fill-current' : ''}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              {mostPopularCourse.rating}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="px-6 pb-4">
                      <div className="text-sm text-blue-600 font-medium group-hover:text-blue-700 transition-colors flex items-center">
                        Explore category
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories Carousel with Background */}
      <section className="relative py-16 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80')] bg-cover bg-fixed bg-center">
        <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Real Success Stories</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">See how our students transformed their careers</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm shadow-lg border border-white/20">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`p-8 transition-opacity duration-500 ${index === currentTestimonial ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
                >
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <div className="w-24 h-24 rounded-full bg-blue-100 mx-auto mb-4 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-blue-600 text-3xl font-bold">
                          {testimonial.name.charAt(0)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white">{testimonial.name}</div>
                        <div className="text-blue-200 mb-2">{testimonial.role}</div>
                        <div className="flex justify-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <div className="text-sm text-blue-100">Passed: {testimonial.exam}</div>
                        <div className="text-sm text-blue-100 mt-1">Study Time: {testimonial.studyTime}</div>
                      </div>
                    </div>

                    <div className="md:w-2/3">
                      <blockquote className="text-lg italic text-white mb-6">
                        &ldquo;I went from scoring {testimonial.before} on practice tests to {testimonial.after} on the actual exam after using this platform for just {testimonial.studyTime}.&rdquo;
                      </blockquote>
                      <p className="text-blue-100">{testimonial.comment}</p>

                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-xs text-blue-200">Before</div>
                          <div className="text-2xl font-bold text-white">{testimonial.before}</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-xs text-blue-200">After</div>
                          <div className="text-2xl font-bold text-green-300">{testimonial.after}</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="text-xs text-blue-200">Salary Increase</div>
                          <div className="text-2xl font-bold text-yellow-300">{testimonial.salaryIncrease}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Navigation */}
              <button
                onClick={() => goToTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => goToTestimonial((currentTestimonial + 1) % testimonials.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${index === currentTestimonial ? 'bg-white' : 'bg-white/50 hover:bg-white/70'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA with Background */}
      <section className="relative py-20 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-fixed bg-center">
        <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Transform Your Career?</h2>
            <p className="text-xl mb-8 text-blue-100">Join our community of successful certified professionals today.</p>

            {/* Popularity indicator */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8 inline-block border border-white/20">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-white" />
                  <span className="text-white">{counters.students.toLocaleString()}+ members</span>
                </div>
                <div className="h-6 w-px bg-white/20"></div>
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-white" />
                  <span className="text-white">{counters.passRate}% pass rate</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold rounded-lg shadow-lg transition-all transform hover:scale-105">
                Start 7-Day Free Trial
              </Link>
              <Link href="/demo" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg shadow-lg border border-white/20 transition-all transform hover:scale-105">
                Watch Demo Video
              </Link>
            </div>
            <p className="mt-4 text-sm text-blue-200">No credit card required • Cancel anytime</p>
          </div>
        </div>
      </section>
    </div>
  );
}