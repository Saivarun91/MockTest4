// app/mentor/dashboard/profile/page.jsx
'use client';
import { useState } from 'react';
import { UserCircleIcon, PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function ProfileTab() {
    const [mentor, setMentor] = useState({
        name: 'Dr. Sarah Johnson',
        email: 'sarah@example.com',
        role: 'Senior Mentor',
        bio: 'Mathematics Professor with 12 years of experience helping students excel in competitive exams. Specialized in Calculus and Algebra.',
        profilePicture: '',
        expertise: ['Mathematics', 'Calculus', 'Algebra', 'Problem Solving'],
    });
    const [isEditing, setIsEditing] = useState(false);
    const [tempBio, setTempBio] = useState(mentor.bio);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setMentor({ ...mentor, profilePicture: event.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setMentor({ ...mentor, bio: tempBio });
        setIsEditing(false);
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden">
                            {mentor.profilePicture ? (
                                <Image src={mentor.profilePicture} alt="Profile" className="w-full h-full object-cover" width={128} height={128} />
                            ) : (
                                <UserCircleIcon className="h-20 w-20 text-gray-400" />
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-md">
                            <PencilSquareIcon className="h-4 w-4" />
                            <input type="file" className="hidden" onChange={handleImageUpload} />
                        </label>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                            {mentor.expertise.map((skill) => (
                                <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{mentor.name}</h2>
                            <p className="text-gray-600">{mentor.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                                {mentor.role}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-md"
                        >
                            <PencilSquareIcon className="h-4 w-4 mr-2" />
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
                        {isEditing ? (
                            <div className="space-y-4">
                                <textarea
                                    value={tempBio}
                                    onChange={(e) => setTempBio(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                                    >
                                        <CheckIcon className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
                                    >
                                        <XMarkIcon className="h-4 w-4 mr-2" />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-700 whitespace-pre-line">{mentor.bio}</p>
                        )}
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-5 rounded-xl">
                            <h3 className="text-sm font-medium text-blue-800 mb-2">Teaching Style</h3>
                            <p className="text-gray-700">Interactive problem-solving with real-world applications</p>
                        </div>
                        <div className="bg-indigo-50 p-5 rounded-xl">
                            <h3 className="text-sm font-medium text-indigo-800 mb-2">Availability</h3>
                            <p className="text-gray-700">Mon-Fri: 9AM-5PM (GMT+5:30)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}