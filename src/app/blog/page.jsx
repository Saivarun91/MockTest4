// src/app/Blog/page.jsx
import Link from 'next/link';
import { allBlogPosts } from '@/data/blogPosts';
import { CalendarIcon, ClockIcon, ChatBubbleBottomCenterTextIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export const metadata = {
    title: 'ExamQuestions Blog - Learn Tips & Strategies',
    description: 'Discover expert tips, exam strategies, and career advice from industry professionals to help you succeed in your certification journey.',
};

export default function BlogPage() {
    const featuredPost = allBlogPosts.find(post => post.featured);
    const regularPosts = allBlogPosts.filter(post => !post.featured);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section with Background Image */}
            <div
                className="relative py-24 text-white bg-cover bg-center"
                style={{
                    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-70"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-5xl font-bold mb-6">Unlock Your Certification Success</h1>
                    <p className="text-xl max-w-3xl mx-auto mb-8">
                        Expert tips, exam strategies, and career advice to help you pass your certification exams with confidence.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/courses"
                            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg flex items-center justify-center"
                        >
                            Explore Our Courses <ArrowRightIcon className="h-5 w-5 ml-2" />
                        </Link>
                        <Link
                            href="#featured"
                            className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
                        >
                            Read Latest Articles
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white py-12 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="p-4">
                            <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                            <div className="text-gray-600">Pass Rate</div>
                        </div>
                        <div className="p-4">
                            <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                            <div className="text-gray-600">Students Certified</div>
                        </div>
                        <div className="p-4">
                            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                            <div className="text-gray-600">Courses Available</div>
                        </div>
                        <div className="p-4">
                            <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                            <div className="text-gray-600">Expert Support</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Post */}
            {featuredPost && (
                <div id="featured" className="container mx-auto px-4 py-16">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
                        <div className="md:flex">
                            <div className="md:flex-shrink-0 md:w-1/2 relative">
                                <Image
                                    className="h-full w-full object-cover"
                                    src={featuredPost.image}
                                    alt={featuredPost.title}
                                    width={800}
                                    height={500}

                                />
                                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    Featured
                                </div>
                            </div>
                            <div className="p-8 md:w-1/2">
                                <div className="flex items-center text-sm text-blue-600 font-semibold mb-2">
                                    <span className="uppercase tracking-wide">Featured Post</span>
                                    <span className="mx-2">•</span>
                                    <span className="text-blue-500 bg-blue-100 px-2 py-1 rounded-full">{featuredPost.category}</span>
                                </div>
                                <Link
                                    href={`/blog/${featuredPost.slug}`}
                                    className="block mt-1 text-3xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                                >
                                    {featuredPost.title}
                                </Link>
                                <p className="mt-3 text-gray-600 text-lg">
                                    {featuredPost.excerpt}
                                </p>
                                <div className="mt-6 flex items-center">
                                    <div className="flex-shrink-0">
                                        <Image
                                            className="h-12 w-12 rounded-full border-2 border-blue-200"
                                            src={featuredPost.author.avatar}
                                            alt={featuredPost.author.name}
                                            width={800}
                                            height={500}
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-lg font-medium text-gray-900">
                                            {featuredPost.author.name}
                                        </p>
                                        <p className="text-sm text-blue-600">{featuredPost.author.role}</p>
                                        <div className="flex space-x-2 text-sm text-gray-500 mt-1">
                                            <time dateTime={featuredPost.date} className="flex items-center">
                                                <CalendarIcon className="h-4 w-4 mr-1" />
                                                {featuredPost.date}
                                            </time>
                                            <span className="flex items-center">
                                                <ClockIcon className="h-4 w-4 mr-1" />
                                                {featuredPost.readingTime}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <Link
                                        href={`/blog/${featuredPost.slug}`}
                                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md"
                                    >
                                        Read Full Article
                                        <ArrowRightIcon className="h-5 w-5 ml-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Course Promo Banner */}
            <div className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Certification?</h2>
                    <p className="text-xl max-w-3xl mx-auto mb-6">
                        Join thousands of students who passed their exams with our comprehensive courses and practice tests.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/courses"
                            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
                        >
                            Browse All Courses
                        </Link>
                        <Link
                            href="/free-trial"
                            className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
                        >
                            Start Free Trial
                        </Link>
                    </div>
                </div>
            </div>

            {/* All Blog Posts */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                        <ChatBubbleBottomCenterTextIcon className="h-8 w-8 mr-3 text-blue-600" />
                        Latest Articles
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {regularPosts.map((post) => (
                            <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                                <Link href={`/Blog/${post.slug}`} className="relative block">
                                    <Image
                                        className="h-56 w-full object-cover group-hover:opacity-90 transition-opacity"
                                        src={post.image}
                                        alt={post.title}
                                        width={800}
                                        height={500}
                                    />
                                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                                        {post.category}
                                    </div>
                                </Link>
                                <div className="p-6">
                                    <div className="flex items-center text-sm text-gray-500 mb-3">
                                        <time dateTime={post.date} className="flex items-center">
                                            <CalendarIcon className="h-4 w-4 mr-1" />
                                            {post.date}
                                        </time>
                                        <span className="mx-2">•</span>
                                        <span className="flex items-center">
                                            <ClockIcon className="h-4 w-4 mr-1" />
                                            {post.readingTime}
                                        </span>
                                    </div>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="block text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-3"
                                    >
                                        {post.title}
                                    </Link>
                                    <p className="text-gray-600 mb-5">{post.excerpt}</p>
                                    <div className="flex justify-between items-center">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center"
                                        >
                                            Read more
                                            <ArrowRightIcon className="h-4 w-4 ml-1" />
                                        </Link>
                                        <div className="flex items-center">
                                            <Image
                                                className="h-8 w-8 rounded-full border border-gray-200"
                                                src={post.author.avatar}
                                                alt={post.author.name}
                                                width={800}
                                                height={500}
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">{post.author.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="bg-gray-100 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Students Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <div className="flex items-center mb-4">
                                <Image
                                    src="https://randomuser.me/api/portraits/women/32.jpg"
                                    alt="Sarah Johnson"
                                    className="h-12 w-12 rounded-full mr-4"
                                    width={800}
                                    height={500}
                                />
                                <div>
                                    <h4 className="font-bold">Sarah Johnson</h4>
                                    <p className="text-blue-600 text-sm">AWS Certified</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">"The practice tests were spot on! I passed my AWS exam on the first try thanks to ExamQuestions."</p>
                            <div className="flex mt-3 text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <div className="flex items-center mb-4">
                                <Image
                                    src="https://randomuser.me/api/portraits/men/45.jpg"
                                    alt="Michael Tan"
                                    className="h-12 w-12 rounded-full mr-4"
                                    width={800}
                                    height={500}
                                />
                                <div>
                                    <h4 className="font-bold">Michael Tan</h4>
                                    <p className="text-blue-600 text-sm">Azure Certified</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">"The course materials were comprehensive and up-to-date. Worth every penny for the confidence they gave me."</p>
                            <div className="flex mt-3 text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <div className="flex items-center mb-4">
                                <Image
                                    src="https://randomuser.me/api/portraits/women/68.jpg"
                                    alt="Priya Patel"
                                    className="h-12 w-12 rounded-full mr-4"
                                    width={800}
                                    height={500}
                                        />
                                <div>
                                    <h4 className="font-bold">Priya Patel</h4>
                                    <p className="text-blue-600 text-sm">Google Cloud Certified</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">"I tried other platforms but ExamQuestions had the most realistic practice questions. Highly recommend!"</p>
                            <div className="flex mt-3 text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final CTA Section */}
            <div className="bg-blue-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Start Your Certification Journey Today</h2>
                    <p className="text-xl max-w-3xl mx-auto mb-8">
                        Join our community of successful certified professionals and take your career to the next level.
                    </p>
                    <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-xl">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose ExamQuestions?</h3>
                        <ul className="space-y-3 text-left text-gray-700">
                            <li className="flex items-start">
                                <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 mt-1 flex-shrink-0" />
                                <span>95% first-time pass rate (industry highest)</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 mt-1 flex-shrink-0" />
                                <span>Updated weekly with latest exam changes</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 mt-1 flex-shrink-0" />
                                <span>Expert instructors with 10+ years experience</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 mt-1 flex-shrink-0" />
                                <span>Money-back guarantee if you don't pass</span>
                            </li>
                        </ul>
                        <div className="mt-8">
                            <Link
                                href="/pricing"
                                className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md text-lg"
                            >
                                View Pricing Plans
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-gray-900 text-white py-16">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h3 className="text-3xl font-bold mb-4">Get Free Exam Tips & Updates</h3>
                    <p className="text-gray-300 text-lg mb-6">
                        Join 50,000+ subscribers who receive weekly study strategies, certification news, and exclusive discounts.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-grow px-5 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md">
                            Subscribe
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </div>
            </div>
        </div>
    );
}