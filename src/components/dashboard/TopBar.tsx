"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || "",
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/trending?search=${encodeURIComponent(searchValue.trim())}`);
    } else {
      router.push("/trending");
    }
  };

  return (
    <header className="fixed top-0 right-0 h-16 lg:h-16 bg-surface/80 backdrop-blur-3xl border-b border-outline-variant/10 flex items-center justify-between px-6 lg:px-16 z-[55] w-full lg:w-[calc(100%-16rem)]">
      <div className="flex items-center gap-4 w-full max-w-2xl group">
        <form onSubmit={handleSearch} className="relative w-full">
          <button
            type="submit"
            className="flex absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 text-lg group-focus-within:text-primary transition-colors hover:text-primary"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
          <input
            className="w-full bg-transparent border-none py-3 pl-8 pr-4 text-sm font-bold text-on-surface placeholder-on-surface-variant/30 focus:ring-0 transition-all outline-none"
            placeholder="Search Intelligence..."
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>
      </div>

      <div className="flex items-center gap-4 lg:gap-6 ml-4">
        <div className="hidden sm:block w-8 h-8 rounded-full bg-stone-100 overflow-hidden ring-1 ring-outline-variant/10">
          <img
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
            alt="User profile avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkcI65c4b0C2ejD7lCee3B0SHkW70Tn9bxhdgYR2dazqde6aOAz4mC4pvt6hxjIRcqri7CdBKs6Nx2v5wQ0towkYlq9GbXk067ZOHRDOsFZ7nx5WNOuf7Xfpe3m3ZgUZJ_EnUGVGEFjBezR7XmH5SCCgJIPWu4SOkACc53oIW3K_9vuAxZPuSoqU2FUKX7bSbOm8rrqcQxKa3VgR3xRbix0oQcEKhv7cVkg5Sx_MEH2yxA4t50pTH6wTqYUCtcRlDedFpQI17caRCm"
          />
        </div>

        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-stone-400 hover:text-on-surface hover:bg-stone-50 transition-all"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
      </div>
    </header>
  );
}
