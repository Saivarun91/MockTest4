// app/mentor/dashboard/conversations/page.jsx
'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FiMessageSquare, FiUser, FiBook, FiPaperclip, FiSend, FiSearch, FiChevronDown } from 'react-icons/fi';

export default function ConversationsPage() {
    const [activeConversation, setActiveConversation] = useState(1);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

    // Mock data - would come from backend
    const conversations = [
        {
            id: 1,
            student: 'Sarah Johnson',
            course: 'Calculus II',
            avatar: '/avatars/sarah-johnson.jpg',
            lastMessage: 'Thanks for the explanation!',
            time: '2 hours ago',
            unread: false,
            messages: [
                { sender: 'student', text: 'Hi, I need help with this integration problem', time: '10:30 AM' },
                { sender: 'mentor', text: 'Sure, can you share the problem?', time: '10:32 AM' },
                { sender: 'student', text: 'It\'s ∫(3x^2 + 2x) dx from 0 to 5', time: '10:35 AM' },
                { sender: 'mentor', text: 'First, find the antiderivative: x^3 + x^2 + C', time: '10:38 AM' },
                { sender: 'student', text: 'Thanks for the explanation!', time: '10:45 AM' },
            ],
            pdfUrl: '/calculus-ii-syllabus.pdf'
        },
        {
            id: 2,
            student: 'Michael Chen',
            course: 'Linear Algebra',
            avatar: '/avatars/michael-chen.jpg',
            lastMessage: 'I\'m still confused about eigenvectors',
            time: '1 day ago',
            unread: true,
            messages: [],
            pdfUrl: '/linear-algebra-textbook.pdf'
        },
        {
            id: 3,
            student: 'Emma Rodriguez',
            course: 'Data Structures',
            avatar: '/avatars/emma-rodriguez.jpg',
            lastMessage: 'When are you available for a session?',
            time: '3 days ago',
            unread: true,
            messages: [
                { sender: 'student', text: 'Hello, I need help with binary trees', time: '9:15 AM' },
                { sender: 'student', text: 'When are you available for a session?', time: '9:16 AM' },
            ],
            pdfUrl: '/data-structures-syllabus.pdf'
        }
    ];

    // Filter conversations based on search term
    const filteredConversations = conversations.filter(conv =>
        conv.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeConvData = conversations.find(conv => conv.id === activeConversation);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConvData?.messages]);

    const handleSendMessage = () => {
        if (message.trim() === '') return;
        // In a real app, this would send to the backend
        setMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex h-full bg-gray-50">
            {/* Conversation List */}
            <div className="w-full md:w-96 border-r border-gray-200 bg-white flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Messages</h1>
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search students or courses..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length > 0 ? (
                        filteredConversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => setActiveConversation(conv.id)}
                                className={`p-4 cursor-pointer transition-colors ${activeConversation === conv.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                                            {conv.avatar ? (
                                                <Image src={conv.avatar} alt={conv.student} className="h-full w-full object-cover" width={40} height={40} />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-500">
                                                    <FiUser size={18} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium text-gray-900 truncate">{conv.student}</h3>
                                            {conv.unread && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">
                                            <span className="font-medium">{conv.course}</span>
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                                            <p className="text-xs text-gray-400 whitespace-nowrap ml-2">{conv.time}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            No conversations found matching your search.
                        </div>
                    )}
                </div>
            </div>

            {/* Conversation Detail */}
            <div className="flex-1 flex flex-col bg-white">
                {activeConvData ? (
                    <>
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                                    {activeConvData.avatar ? (
                                        <Image src={activeConvData.avatar} alt={activeConvData.student} className="h-full w-full object-cover" width={40} height={40} />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-500">
                                            <FiUser size={18} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">{activeConvData.student}</h2>
                                    <p className="text-sm text-gray-600">{activeConvData.course}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Link
                                    href={activeConvData.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                                >
                                    <FiBook className="mr-2" /> Syllabus
                                </Link>
                                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition">
                                    <FiChevronDown />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                            {activeConvData.messages.length > 0 ? (
                                <div className="space-y-4">
                                    {activeConvData.messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${msg.sender === 'mentor' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${msg.sender === 'mentor'
                                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}`}
                                            >
                                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                                <p className={`text-xs mt-1 text-right ${msg.sender === 'mentor' ? 'text-blue-200' : 'text-gray-500'}`}>
                                                    {msg.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                                    <FiMessageSquare size={48} className="text-gray-300" />
                                    <p className="text-lg">No messages yet</p>
                                    <p className="text-sm">Start the conversation with {activeConvData.student}</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
                            <div className="flex items-center space-x-2">
                                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition">
                                    <FiPaperclip />
                                </button>
                                <div className="flex-1 relative">
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder={`Message ${activeConvData.student}...`}
                                        rows={1}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    />
                                </div>
                                <button
                                    className={`p-2 rounded-full transition ${message.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`}
                                    onClick={handleSendMessage}
                                    disabled={!message.trim()}
                                >
                                    <FiSend />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                        <FiMessageSquare size={48} className="text-gray-300" />
                        <p className="text-lg">Select a conversation</p>
                        <p className="text-sm">Choose from your messages to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}