'use client';
import Link from 'next/link';
import { FiEdit2, FiTrash2, FiEye, FiMoreVertical } from 'react-icons/fi';

export default function DataTable({ data, columns }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                            {columns.map((column, colIndex) => {
                                if (column.accessor === 'actions') {
                                    return (
                                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button className="text-blue-600 hover:text-blue-900">
                                                    <FiEye size={16} />
                                                </button>
                                                <button className="text-green-600 hover:text-green-900">
                                                    <FiEdit2 size={16} />
                                                </button>
                                                <button className="text-red-600 hover:text-red-900">
                                                    <FiTrash2 size={16} />
                                                </button>
                                                <button className="text-gray-600 hover:text-gray-900">
                                                    <FiMoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    );
                                }
                                return (
                                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {row[column.accessor]}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                            <span className="font-medium">20</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <Link
                                href="#"
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <span className="sr-only">Previous</span>
                                &larr; Previous
                            </Link>
                            <Link
                                href="#"
                                aria-current="page"
                                className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                            >
                                1
                            </Link>
                            <Link
                                href="#"
                                className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                            >
                                2
                            </Link>
                            <Link
                                href="#"
                                className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                            >
                                3
                            </Link>
                            <Link
                                href="#"
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <span className="sr-only">Next</span>
                                Next &rarr;
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}