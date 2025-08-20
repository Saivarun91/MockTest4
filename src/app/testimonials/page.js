'use client';
import { StarIcon, AcademicCapIcon, BriefcaseIcon, ChartBarIcon, ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const testimonials = [
    {
        id: 1,
        name: 'Sarah Johnson',
        role: 'Software Engineer at Google',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        rating: 5,
        content: 'ExamQuestions helped me ace my AWS certification on the first try. The practice questions were spot-on and mirrored the actual exam difficulty.',
        stats: { exams: 3, score: '98%' },
        video: 'https://player.vimeo.com/video/824804225?h=581b9babc9'
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'Data Scientist',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        rating: 5,
        content: 'The platform provided me with the perfect preparation for my Microsoft Azure exams. I went from beginner to certified in just 2 months!',
        stats: { exams: 5, score: '95%' },
        video: 'https://player.vimeo.com/video/824804225?h=581b9babc9'
    },
    {
        id: 3,
        name: 'Priya Patel',
        role: 'IT Manager',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        rating: 4,
        content: 'As a working professional, the flexibility and quality of ExamQuestions allowed me to study efficiently and pass my CISSP exam while balancing work.',
        stats: { exams: 2, score: '92%' },
    },
    {
        id: 4,
        name: 'David Wilson',
        role: 'Student',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        rating: 5,
        content: 'The detailed explanations for each question helped me understand concepts rather than just memorize answers. This was crucial for my CompTIA Network+ certification.',
        stats: { exams: 4, score: '96%' },
    },
    {
        id: 5,
        name: 'Emily Rodriguez',
        role: 'Cybersecurity Analyst',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        rating: 5,
        content: 'I tried several platforms before finding ExamQuestions. The quality of their practice tests for CEH was unmatched and directly contributed to my success.',
        stats: { exams: 3, score: '94%' },
    },
    {
        id: 6,
        name: 'James Kim',
        role: 'Cloud Architect',
        avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        rating: 5,
        content: 'The realistic exam simulations gave me the confidence I needed to pass my GCP Professional Cloud Architect exam with flying colors.',
        stats: { exams: 6, score: '97%' },
        video: 'https://player.vimeo.com/video/824804225?h=581b9babc9'
    },
];

export default function Testimonials() {
    const [activeVideo, setActiveVideo] = useState(null);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const openVideo = (videoUrl) => {
        setActiveVideo(videoUrl);
    };

    const closeVideo = () => {
        setActiveVideo(null);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section with Unsplash Background Image */}
            <div
                className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-32 overflow-hidden"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1800&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundBlendMode: 'multiply'
                }}
            >
                <div className="absolute inset-0 bg-black opacity-30"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                        Transform Your Career
                    </h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
                        Join <span className="font-bold">10,000+ professionals</span> who aced their certifications with our platform
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            Start Free Trial <ArrowRightIcon className="h-5 w-5" />
                        </Link>
                        <Link
                            href="#testimonials"
                            className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                        >
                            See Success Stories
                        </Link>
                    </div>
                </div>

             
            </div>

            {/* Stats Section with Animation */}
            <div
                className="container mx-auto px-4 py-16 -mt-20 relative z-20"
                style={{
                    transform: `translateY(${Math.min(scrollY * 0.2, 60)}px)`
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                        <div className="flex justify-center mb-6">
                            <div className="bg-blue-100 p-4 rounded-full">
                                <AcademicCapIcon className="h-10 w-10 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-4xl font-bold text-gray-900 mb-3">10,000+</h3>
                        <p className="text-gray-600 text-lg">Certifications Earned</p>
                        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                        <div className="flex justify-center mb-6">
                            <div className="bg-blue-100 p-4 rounded-full">
                                <BriefcaseIcon className="h-10 w-10 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-4xl font-bold text-gray-900 mb-3">92%</h3>
                        <p className="text-gray-600 text-lg">Career Advancement Rate</p>
                        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                        <div className="flex justify-center mb-6">
                            <div className="bg-blue-100 p-4 rounded-full">
                                <ChartBarIcon className="h-10 w-10 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-4xl font-bold text-gray-900 mb-3">4.9/5</h3>
                        <p className="text-gray-600 text-lg">Average Student Rating</p>
                        <div className="mt-4 flex justify-center">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon
                                    key={i}
                                    className={`h-6 w-6 ${i < 4 ? 'text-yellow-400 fill-current' : i === 4 ? 'text-yellow-400 fill-current opacity-60' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Testimonial */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl mx-auto">
                        <div className="md:flex">
                            <div className="md:w-1/2 relative">
                                <div className="h-full bg-gray-200">
                                    <Image
                                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                                        alt="Featured Student"
                                        width={800}
  height={500}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    onClick={() => openVideo('https://player.vimeo.com/video/824804225?h=581b9babc9')}
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-4 hover:bg-opacity-100 transition-all"
                                >
                                    <PlayIcon className="h-12 w-12 text-blue-600" />
                                </button>
                            </div>
                            <div className="md:w-1/2 p-10">
                                <div className="flex mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            className={`h-6 w-6 ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <blockquote className="text-2xl font-medium text-gray-800 mb-8">
                                    &quot;I went from an entry-level IT position to a Cloud Architect role at a Fortune 500 company within a year, thanks to ExamQuestions comprehensive certification training.!&quot;
                                </blockquote>
                                <div className="flex items-center">
                                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mr-6">
                                        <Image
                                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
                                            alt="Featured Student"
                                            className="w-full h-full object-cover"
                                            width={800}
  height={500}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-xl">Alex Turner</h3>
                                        <p className="text-gray-600">Cloud Architect at Amazon Web Services</p>
                                        <div className="mt-2 flex items-center text-sm text-gray-500">
                                            <AcademicCapIcon className="h-4 w-4 mr-1" />
                                            <span>6 certifications completed</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <Link
                                        href="/alex-story"
                                        className="text-blue-600 font-semibold flex items-center hover:text-blue-800"
                                    >
                                        Read Alex&aposs full success story
                                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Grid */}
            {/* <div id="testimonials" className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Professionals at</h2>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-8">
                        <Image src="https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" alt="Google" className="h-10 opacity-70 hover:opacity-100 transition-opacity" width={800} height={500} />
                        <Image src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" alt="Amazon" className="h-10 opacity-70 hover:opacity-100 transition-opacity" width={800} height={500} />
                        <Image src="https://images.unsplash.com/photo-1592609931095-54a2168ae893?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" alt="Microsoft" className="h-10 opacity-70 hover:opacity-100 transition-opacity" width={800} height={500} />
                        <Image src="https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" alt="IBM" className="h-10 opacity-70 hover:opacity-100 transition-opacity" width={800} height={500} />
                        <Image src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" alt="Oracle" className="h-10 opacity-70 hover:opacity-100 transition-opacity" width={800} height={500} />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What Our Students Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className="relative h-48 bg-gray-200 overflow-hidden">
                                {testimonial.video ? (
                                    <>
                                        <Image
                                            src={`https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80&${testimonial.id}`}
                                            alt={testimonial.name}
                                            className="w-full h-full object-cover"
                                            width={800}
  height={500}
                                        />
                                        <button
                                            onClick={() => openVideo(testimonial.video)}
                                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-3 hover:bg-opacity-100 transition-all"
                                        >
                                            <PlayIcon className="h-8 w-8 text-blue-600" />
                                        </button>
                                    </>
                                ) : (
                                    <Image
                                        src={`https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80&${testimonial.id}`}
                                        alt={testimonial.name}
                                        className="w-full h-full object-cover"
                                        width={800}
  height={500}
                                    />
                                )}
                            </div>
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                                        <Image
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80';
                                            }}
                                            width={800}
  height={500}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                                    </div>
                                </div>
                                <div className="flex mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-4">{testimonial.content}</p>
                                <div className="flex justify-between text-sm text-gray-500 border-t pt-4">
                                    <span className="flex items-center">
                                        <AcademicCapIcon className="h-4 w-4 mr-1" />
                                        {testimonial.stats.exams} exams passed
                                    </span>
                                    <span>Average score: {testimonial.stats.score}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div> */}

            {/* Certification Showcase */}
            <div className="bg-gray-900 text-white py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4">Certifications We Help You Achieve</h2>
                    <p className="text-xl text-center text-gray-300 mb-12 max-w-3xl mx-auto">
                        Prepare for the most in-demand IT certifications with our comprehensive study materials
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {[
                            { name: 'AWS Certified', logo: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80' },
                            { name: 'Microsoft Azure', logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80' },
                            { name: 'Google Cloud', logo: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80' },
                            { name: 'CISSP', logo: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80' },
                            { name: 'CEH', logo: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80' },
                            { name: 'CompTIA', logo: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80' },
                        ].map((cert, index) => (
                            <div key={index} className="bg-gray-800 rounded-lg p-6 flex flex-col items-center hover:bg-gray-700 transition-colors">
                                <div className="w-20 h-20 mb-4 bg-white rounded-lg p-2 flex items-center justify-center">
                                    <Image src={cert.logo} alt={cert.name} className="max-h-full max-w-full" width={800} height={500} />
                                </div>
                                <h3 className="text-lg font-medium text-center">{cert.name}</h3>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href="/certifications"
                            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg"
                        >
                            Explore All Certifications
                            <ArrowRightIcon className="h-5 w-5 ml-2" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* CTA Section with Countdown */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-20"></div>
                </div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Limited Time Offer</h2>
                    <div className="flex justify-center mb-8">
                        <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3 flex items-center">
                            <span className="text-2xl font-bold mr-2 text-black">30% OFF</span>
                            <span className='text-black'>All Annual Plans</span>
                        </div>
                    </div>
                    <div className="flex justify-center mb-8">
                        <div className="flex space-x-4">
                            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                                <div className="text-3xl text-black font-bold">02</div>
                                <div className="text-sm text-black">Days</div>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                                <div className="text-3xl text-black font-bold">12</div>
                                <div className="text-sm text-black">Hours</div>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                                <div className="text-3xl text-black font-bold">45</div>
                                <div className="text-sm text-black">Minutes</div>
                            </div>
                        </div>
                    </div>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Join thousands of students who have transformed their careers with our certification preparation platform
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Get Started for Free
                        </Link>
                        <Link
                            href="/pricing"
                            className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-all"
                        >
                            View Pricing Plans
                        </Link>
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            {activeVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-4xl">
                        <button
                            onClick={closeVideo}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300"
                        >
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="aspect-w-16 aspect-h-9 bg-black">
                            <iframe
                                src={activeVideo}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="autoplay; fullscreen"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
