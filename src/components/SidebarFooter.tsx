'use client';

import React from 'react';

interface SidebarFooterProps {
    onLogout: () => void;
}

export default function SidebarFooter({
    onLogout,
}: SidebarFooterProps) {
    const handleVisitWebsite = () => {
        window.location.href = '/';
    };

    return (
        <div className="border-t border-orange-100 p-3">
            {/* Lihat Website */}
            <button
                type="button"
                onClick={handleVisitWebsite}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 transition hover:bg-orange-50 hover:text-[#F58220]"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-[18px] w-[18px] shrink-0"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 4h6m0 0v6m0-6L10 14"
                    />
                </svg>

                <span>Lihat Website</span>
            </button>

            {/* Logout */}
            <button
                type="button"
                onClick={onLogout}
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-50"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-[18px] w-[18px] shrink-0"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 12h9m0 0l-3-3m3 3l-3 3"
                    />
                </svg>

                <span>Keluar</span>
            </button>
        </div>
    );
}