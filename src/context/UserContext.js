'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);

    // Load saved user & token from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('user');
            const savedToken = localStorage.getItem('token');
            const savedRole = localStorage.getItem('role');

            if (savedUser) setUser(JSON.parse(savedUser));
            if (savedToken) setToken(savedToken);
            if (savedRole) setRole(savedRole);
        }
    }, []);

    // Fetch courses on mount
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/`);
            if (response.ok) {
                const data = await response.json();
                setCourses(data.courses || []);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const addCourse = (newCourse) => setCourses(prev => [...prev, newCourse]);
    const updateCourse = (updatedCourse) =>
        setCourses(prev => prev.map(course => course.id === updatedCourse.id ? updatedCourse : course));
    const removeCourse = (courseId) =>
        setCourses(prev => prev.filter(course => course.id !== courseId));
    const removeCourses = (courseIds) =>
        setCourses(prev => prev.filter(course => !courseIds.includes(course.id)));

    const login = (userData, token, role) => {
        setUser(userData);
        setToken(token);
        setRole(role);
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider
            value={{
                user,
                login,
                logout,
                courses,
                addCourse,
                updateCourse,
                removeCourse,
                removeCourses,
                fetchCourses,
                loading,
                token,
                role
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
