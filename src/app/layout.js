// src/app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { UserProvider } from '@/context/UserContext';
import ConditionalLayout from '@/components/ConditionalLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ExamQuestions - Master Your Certification Exams',
  description: 'Practice with thousands of exam questions and ace your certification exams',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 antialiased overflow-x-hidden`}>
        <UserProvider>

          <div className="min-h-screen flex flex-col">
            <ConditionalLayout>

              <main className="flex-grow">
                {children}
              </main>
              <ToastContainer
                theme="dark"
                position="top-right"
                autoClose={3000}
                closeOnClick
                pauseOnHover={false}
              />
            </ConditionalLayout>

          </div>
        </UserProvider>
      </body>
    </html>
  );
}