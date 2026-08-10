'use client';

import React from 'react';

export default function SidebarUser() {
    return (
        <div className="border-b border-orange-100 px-5 py-5">
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[#F58220]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 20.25a7.5 7.5 0 0115 0"
                        />
                    </svg>
                </div>

                {/* Identity */}
                <div className="min-w-0">
                    <div
                        className="truncate text-sm font-bold text-gray-900"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        Super Admin
                    </div>

                    <div className="mt-0.5 truncate text-xs text-gray-500">
                        Administrator
                    </div>
                </div>
            </div>
        </div>
    );
}