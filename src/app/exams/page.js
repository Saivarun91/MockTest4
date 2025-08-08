// src/app/exams/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Star, Clock, ChevronDown, ChevronUp, Award } from 'lucide-react';
import { allExams } from '@/data/exams';
import Image from 'next/image';

const ExamsPage = () => {
    // All exam data


    // State for filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedDifficulties, setSelectedDifficulties] = useState([]);
    const [showPremium, setShowPremium] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Get unique categories and difficulties
    const categories = [...new Set(allExams.map(exam => exam.category))];
    const difficulties = ["Beginner", "Intermediate", "Advanced"];
    function slugify(text) {
        return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }



    // Filter exams based on selections
    const filteredExams = allExams.filter(exam => {
        // Search term filter
        const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.category.toLowerCase().includes(searchTerm.toLowerCase());

        // Category filter
        const matchesCategory = selectedCategories.length === 0 ||
            selectedCategories.includes(exam.category);

        // Difficulty filter
        const matchesDifficulty = selectedDifficulties.length === 0 ||
            selectedDifficulties.includes(exam.difficulty);

        // Premium filter
        const matchesPremium = !showPremium || exam.premium;

        return matchesSearch && matchesCategory && matchesDifficulty && matchesPremium;
    });

    // Toggle category selection
    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    // Toggle difficulty selection
    const toggleDifficulty = (difficulty) => {
        setSelectedDifficulties(prev =>
            prev.includes(difficulty)
                ? prev.filter(d => d !== difficulty)
                : [...prev, difficulty]
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Certification</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Browse our comprehensive collection of certification exam preparation materials
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Search and Filter Bar */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search exams by name or category..."
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filter Toggle Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                        >
                            <Filter className="h-5 w-5 text-gray-600 mr-2" />
                            <span>Filters</span>
                            {showFilters ? (
                                <ChevronUp className="h-5 w-5 text-gray-600 ml-2" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-600 ml-2" />
                            )}
                        </button>
                    </div>

                    {/* Expanded Filters */}
                    {showFilters && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Category Filter */}
                                <div>
                                    <h3 className="font-medium text-gray-700 mb-3">Categories</h3>
                                    <div className="space-y-2">
                                        {categories.map((category) => (
                                            <label key={category} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(category)}
                                                    onChange={() => toggleCategory(category)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <span className="ml-2 text-gray-700">{category}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Difficulty Filter */}
                                <div>
                                    <h3 className="font-medium text-gray-700 mb-3">Difficulty</h3>
                                    <div className="space-y-2">
                                        {difficulties.map((difficulty) => (
                                            <label key={difficulty} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedDifficulties.includes(difficulty)}
                                                    onChange={() => toggleDifficulty(difficulty)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <span className="ml-2 text-gray-700">{difficulty}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Premium Filter */}
                                <div>
                                    <h3 className="font-medium text-gray-700 mb-3">Content Type</h3>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={showPremium}
                                            onChange={() => setShowPremium(!showPremium)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-gray-700">Show Premium Only</span>
                                    </label>
                                </div>
                            </div>

                            {/* Reset Filters */}
                            {(selectedCategories.length > 0 || selectedDifficulties.length > 0 || showPremium) && (
                                <div className="mt-4">
                                    <button
                                        onClick={() => {
                                            setSelectedCategories([]);
                                            setSelectedDifficulties([]);
                                            setShowPremium(false);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Reset all filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {filteredExams.length} {filteredExams.length === 1 ? 'Exam' : 'Exams'} Found
                    </h2>
                </div>

                {/* Exams Grid */}
                {filteredExams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredExams.map((exam) => (
                            <div key={exam.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
                                <div className="p-6">
                                    {/* Exam Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${exam.category === "Cloud Computing" ? "bg-blue-100 text-blue-800" :
                                                exam.category === "Project Management" ? "bg-purple-100 text-purple-800" :
                                                    exam.category === "Cyber Security" ? "bg-green-100 text-green-800" :
                                                        exam.category === "Data Science" ? "bg-orange-100 text-orange-800" :
                                                            "bg-gray-100 text-gray-800"
                                                }`}>
                                                {exam.category}
                                            </span>
                                            {exam.new && (
                                                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="ml-1 text-gray-700 font-medium">{exam.popularity}%</span>
                                        </div>
                                    </div>

                                    {/* Exam Title */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{exam.title}</h3>

                                    {/* Exam Meta */}
                                    <div className="flex items-center text-gray-600 mb-4">
                                        <Clock className="w-4 h-4 mr-2" />
                                        <span>{exam.duration} • {exam.questions} Questions</span>
                                    </div>

                                    {/* Difficulty */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>Difficulty:</span>
                                            <span className="font-medium">
                                                {exam.difficulty === "Beginner" ? (
                                                    <span className="text-green-600">Beginner</span>
                                                ) : exam.difficulty === "Intermediate" ? (
                                                    <span className="text-blue-600">Intermediate</span>
                                                ) : (
                                                    <span className="text-purple-600">Advanced</span>
                                                )}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${exam.difficulty === "Beginner" ? "bg-green-500" :
                                                    exam.difficulty === "Intermediate" ? "bg-blue-500" :
                                                        "bg-purple-500"
                                                    }`}
                                                style={{
                                                    width:
                                                        exam.difficulty === "Beginner" ? "33%" :
                                                            exam.difficulty === "Intermediate" ? "66%" :
                                                                "100%"
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <Link
                                        href={`/exams/${exam.slug}`}
                                        className={`block w-full text-center px-4 py-3 rounded-lg font-medium transition-colors ${exam.premium
                                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md"
                                            : "bg-blue-600 hover:bg-blue-700 text-white"
                                            }`}
                                    >
                                        {exam.premium ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Award className="w-5 h-5" />
                                                Premium Content
                                            </span>
                                        ) : (
                                            "Start Practicing"
                                        )}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // No results state
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <div className="mx-auto max-w-md">
                            <Search className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No exams found</h3>
                            <p className="mt-1 text-gray-500">
                                Try adjusting your search or filter criteria to find what you're looking for.
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategories([]);
                                        setSelectedDifficulties([]);
                                        setShowPremium(false);
                                    }}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                >
                                    Reset all filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Premium CTA */}
                <div className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-8 md:p-10 text-center">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Unlock All Premium Exams
                            </h2>
                            <p className="text-purple-100 mb-6">
                                Get full access to our premium question bank, detailed explanations, and AI-powered study plans.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link
                                    href="/premium"
                                    className="px-6 py-3 bg-white hover:bg-gray-100 text-purple-600 font-medium rounded-lg shadow-md transition-colors"
                                >
                                    Explore Premium
                                </Link>
                                <Link
                                    href="/exams/premium-demo"
                                    className="px-6 py-3 bg-transparent hover:bg-purple-700 text-white font-medium rounded-lg shadow-md border-2 border-white transition-colors"
                                >
                                    Try Premium Demo
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamsPage;