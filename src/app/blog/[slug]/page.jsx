// src/app/Blog/[slug]/page.jsx
import { notFound } from 'next/navigation';
import { allBlogPosts } from '@/data/blogPosts';
import { CalendarIcon, ClockIcon, ShareIcon, BookmarkIcon, ArrowRightIcon, AcademicCapIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

export async function generateMetadata({ params }) {
    const post = allBlogPosts.find(post => post.slug === params.slug);

    if (!post) {
        return {
            title: 'Post Not Found - ExamQuestions Blog',
            description: 'The requested blog post could not be found.',
        };
    }

    return {
        title: `${post.title} - ExamQuestions Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.image],
        },
    };
}

export default function BlogPostPage({ params }) {
    const post = allBlogPosts.find(post => post.slug === params.slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Background Image */}
            <div
                className="relative bg-gray-900 text-white py-20 md:py-28"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${post.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    <div className="mb-6">
                        <Link
                            href={`/blog?category=${post.category.toLowerCase().replace(' ', '-')}`}
                            className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            {post.category}
                        </Link>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <p className="text-xl text-blue-100 mb-8 max-w-3xl">{post.excerpt}</p>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
                        <div className="flex items-center">
                            <Image
                                className="h-12 w-12 rounded-full mr-4 border-2 border-blue-300 shadow-sm"
                                src={post.author.avatar}
                                alt={post.author.name}
                                width={800}
                                height={500}
                            />
                            <div>
                                <p className="font-medium text-white">{post.author.name}</p>
                                <p className="text-sm text-blue-200">{post.author.role}</p>
                                <div className="flex items-center text-sm text-blue-200 mt-1">
                                    <time dateTime={post.date} className="flex items-center">
                                        <CalendarIcon className="h-4 w-4 mr-1" />
                                        {post.date}
                                    </time>
                                    <span className="mx-2">·</span>
                                    <span className="flex items-center">
                                        <ClockIcon className="h-4 w-4 mr-1" />
                                        {post.readingTime}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating CTA Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 shadow-lg">
                <div className="container mx-auto px-4 max-w-4xl flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-3 md:mb-0">
                        <AcademicCapIcon className="h-6 w-6 mr-3" />
                        <p className="font-medium">Want to master this topic? Enroll in our comprehensive course!</p>
                    </div>
                    <Link
                        href="/courses"
                        className="px-6 py-2 bg-white text-blue-800 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-sm"
                    >
                        Explore Courses
                    </Link>
                </div>
            </div>

            {/* Article Content */}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="prose prose-lg max-w-none">
                    <div
                        className="blog-content"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>

                {/* Key Takeaways Box */}
                <div className="mt-12 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <CheckCircleIcon className="h-6 w-6 text-blue-600 mr-2" />
                        Key Takeaways
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                        {post.keyTakeaways?.map((item, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-blue-500 mr-2">✓</span>
                                {item}
                            </li>
                        )) || (
                                <>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        This article covers essential concepts you need to know
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        Practical examples help reinforce learning
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        Our courses provide deeper dives into these topics
                                    </li>
                                </>
                            )}
                    </ul>
                </div>

                {/* Course Promotion Section */}
                <div className="mt-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl overflow-hidden shadow-xl">
                    <div className="p-8 text-white">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                                <h2 className="text-2xl font-bold mb-4">Ready to take your learning to the next level?</h2>
                                <p className="text-blue-100 mb-6">
                                    Our comprehensive courses include video lectures, practice exams, and expert support to help you master this subject.
                                </p>
                                <ul className="space-y-3 mb-6">
                                    <li className="flex items-center">
                                        <CheckCircleIcon className="h-5 w-5 text-blue-300 mr-2" />
                                        <span>Interactive video lessons</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircleIcon className="h-5 w-5 text-blue-300 mr-2" />
                                        <span>Practice questions with explanations</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircleIcon className="h-5 w-5 text-blue-300 mr-2" />
                                        <span>Progress tracking and certifications</span>
                                    </li>
                                </ul>
                                <Link
                                    href="/courses"
                                    className="inline-block px-6 py-3 bg-white text-blue-800 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-sm"
                                >
                                    View Course Details
                                </Link>
                            </div>
                            <div className="md:w-1/3">
                                <div className="bg-white/10 p-4 rounded-lg border border-blue-400/30">
                                    <p className="text-sm text-blue-200 mb-2">SPECIAL OFFER</p>
                                    <p className="text-xl font-bold mb-2">Get 20% Off Today!</p>
                                    <p className="text-sm text-blue-100">Use code <span className="font-mono bg-blue-800 px-2 py-1 rounded">BLOG20</span> at checkout</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Author Bio */}
                <div className="mt-16 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-start">
                        <Image
                            className="h-16 w-16 rounded-full mr-4 border-2 border-white shadow-sm"
                            src={post.author.avatar}
                            alt={post.author.name}
                            width={800}
                            height={500}
                        />
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">About {post.author.name}</h3>
                            <p className="text-gray-600 mb-4">{post.author.role}</p>
                            <p className="text-gray-700">
                                {post.author.bio || `${post.author.name} is an expert in this field with years of teaching experience. They've helped hundreds of students achieve their learning goals through our courses.`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Related Posts */}
                {post.relatedPosts && post.relatedPosts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Continue Learning</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {post.relatedPosts.map(relatedSlug => {
                                const relatedPost = allBlogPosts.find(p => p.slug === relatedSlug);
                                if (!relatedPost) return null;

                                return (
                                    <article key={relatedSlug} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                                        <Link href={`/blog/${relatedPost.slug}`} className="block">
                                            <div className="flex items-center mb-4">
                                                <div className="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
                                                <span className="text-sm font-medium text-gray-500">{relatedPost.category}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                                                {relatedPost.title}
                                            </h3>
                                            <p className="text-gray-600 mb-4">{relatedPost.excerpt}</p>
                                            <div className="flex items-center text-blue-600 font-medium">
                                                Read article
                                                <ArrowRightIcon className="h-4 w-4 ml-1" />
                                            </div>
                                        </Link>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Final CTA Section */}
                <div className="mt-16 bg-gradient-to-r from-blue-50 to-white p-8 rounded-xl border border-blue-100 text-center">
                    <AcademicCapIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Learning Today</h2>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Join thousands of students who have accelerated their learning with our expertly designed courses.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/courses"
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow-sm"
                        >
                            Browse All Courses
                        </Link>
                        <Link
                            href="/free-trial"
                            className="px-8 py-3 text-blue-600 hover:text-blue-800 font-bold transition-colors border-2 border-blue-600 rounded-lg hover:border-blue-800"
                        >
                            Try Free Lesson
                        </Link>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-16 pt-8 border-t border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Join the Discussion</h2>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-600 mb-6">Sign in to share your thoughts and questions about this article.</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/login"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-center"
                            >
                                Log in to comment
                            </Link>
                            <Link
                                href="/register"
                                className="px-6 py-3 text-gray-600 hover:text-blue-600 font-medium transition-colors text-center border border-gray-200 rounded-lg hover:border-blue-200"
                            >
                                Create account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}