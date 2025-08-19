'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar'; // adjust as needed
import Footer from './Footer'; // adjust as needed

const HIDDEN_PATHS = ['/mentor/dashboard', '/admin'];

export default function ConditionalLayout({ children }) {
    const pathname = usePathname();

    const shouldHideLayout = HIDDEN_PATHS.some((path) =>
        pathname.startsWith(path)
    );

    return (
        <>
            {!shouldHideLayout && <Navbar />}
            {children}
            {!shouldHideLayout && <Footer />}
        </>
    );
}
