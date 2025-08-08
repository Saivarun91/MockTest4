// src/components/Footer.jsx
'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone, Twitter, Github, Linkedin, Rss, Facebook, Youtube } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isHovering, setIsHovering] = useState(null);

    const footerLinks = [
        {
            title: 'Company',
            links: [
                { name: 'About Us', href: '/about', icon: null },
                { name: 'Careers', href: '/careers', icon: null },
                { name: 'Contact', href: '/contact', icon: null },
                { name: 'Press', href: '/press', icon: null },
            ],
        },
        {
            title: 'Resources',
            links: [
                { name: 'Blog', href: '/blog', icon: <Rss className="w-4 h-4 mr-2" /> },
                { name: 'Help Center', href: '/help', icon: null },
                { name: 'Tutorials', href: '/tutorials', icon: null },
                { name: 'Webinars', href: '/webinars', icon: null },
            ],
        },
        {
            title: 'Legal',
            links: [
                { name: 'Privacy', href: '/privacy', icon: null },
                { name: 'Terms', href: '/terms', icon: null },
                { name: 'Cookie Policy', href: '/cookies', icon: null },
                { name: 'Accessibility', href: '/accessibility', icon: null },
            ],
        },
    ];

    const socialLinks = [
        { name: 'Twitter', href: '#', icon: <Twitter className="w-5 h-5" /> },
        { name: 'GitHub', href: '#', icon: <Github className="w-5 h-5" /> },
        { name: 'LinkedIn', href: '#', icon: <Linkedin className="w-5 h-5" /> },
        { name: 'Facebook', href: '#', icon: <Facebook className="w-5 h-5" /> },
        { name: 'YouTube', href: '#', icon: <Youtube className="w-5 h-5" /> },
    ];

    const contactInfo = [
        { text: 'hello@examquestions.com', icon: <Mail className="w-4 h-4" /> },
        { text: '+1 (555) 123-4567', icon: <Phone className="w-4 h-4" /> },
        { text: '123 Certification St, San Francisco, CA', icon: <MapPin className="w-4 h-4" /> },
    ];

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail('');
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center space-x-2 mb-4 group">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-blue-700 transition-colors">
                                EQ
                            </div>
                            <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                ExamQuestions
                            </span>
                        </Link>
                        <p className="mb-4 max-w-md">
                            The most comprehensive platform for certification exam preparation with thousands of practice questions and AI-powered analytics.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-2 mb-6">
                            {contactInfo.map((item, index) => (
                                <div key={index} className="flex items-center">
                                    <span className="text-blue-400 mr-2">{item.icon}</span>
                                    <span className="hover:text-white transition-colors">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.name}
                                    href={social.href}
                                    className={`p-2 rounded-full ${isHovering === social.name ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'} transition-colors`}
                                    onMouseEnter={() => setIsHovering(social.name)}
                                    onMouseLeave={() => setIsHovering(null)}
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-white font-semibold mb-4 text-lg">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="hover:text-white transition-colors flex items-center"
                                        >
                                            {link.icon}
                                            <span className={link.icon ? 'ml-1' : ''}>{link.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div className="lg:col-span-2">
                        <h3 className="text-white font-semibold mb-6 text-xl text-center lg:text-left">Stay Updated</h3>
                        <p className="mb-6 text-gray-300 text-center lg:text-left">
                            Get the latest exam tips and resources delivered to your inbox.
                        </p>

                        {isSubscribed ? (
                            <div className="bg-green-100/90 text-green-800 p-4 rounded-lg text-center animate-fade-in">
                                <CheckCircle className="w-5 h-5 mx-auto mb-2" />
                                <p className="font-medium">Thank you for subscribing!</p>
                                <p className="text-sm mt-1">We've sent a confirmation to your email.</p>
                            </div>
                        ) : (
                            <div className="max-w-md mx-auto lg:mx-0">
                                <form onSubmit={handleSubscribe} className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="w-full px-5 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400 transition-all"
                                            required
                                        />
                                        <Mail className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 rounded-lg text-white font-medium transition-all flex items-center justify-center shadow-lg hover:shadow-blue-500/20"
                                    >
                                        <Mail className="w-5 h-5 mr-2" />
                                        Subscribe Now
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="mt-10 text-center lg:text-left">
                            <h4 className="text-white font-medium mb-4 text-lg">Get Our Mobile App</h4>
                            <p className="text-gray-400 mb-4 max-w-md mx-auto lg:mx-0">
                                Access your courses anytime, anywhere with our mobile application.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3">
                                <Link
                                    href="#"
                                    className="bg-black/90 hover:bg-black text-white px-4 py-3 rounded-lg flex items-center justify-center transition-all hover:scale-[1.02]"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                                        </svg>
                                        <div className="text-left">
                                            <div className="text-xs">Download on</div>
                                            <div className="font-bold text-sm">Google Play</div>
                                        </div>
                                    </div>
                                </Link>
                                <Link
                                    href="#"
                                    className="bg-black/90 hover:bg-black text-white px-4 py-3 rounded-lg flex items-center justify-center transition-all hover:scale-[1.02]"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.96-.2 1.85-.7 2.83-.64 1.18.03 2.27.49 3.08 1.34-2.8 1.69-2.1 5.12.02 6.38-.5 1.17-.78 2.38-1.01 3.69zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.2 2.58-2.34 4.5-3.74 4.25z" />
                                        </svg>
                                        <div className="text-left">
                                            <div className="text-xs">Download on the</div>
                                            <div className="font-bold text-sm">App Store</div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} ExamQuestions. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/cookies" className="text-gray-500 hover:text-white transition-colors">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}