"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Disable body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navItems = [
    { label: "Dashboard", icon: "dashboard", path: "/" },
    { label: "Trending", icon: "trending_up", path: "/trending" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed left-0 top-0 bottom-0 h-screen w-72 sm:w-80 lg:w-64 bg-surface-container-low border-r border-outline-variant/10
        flex flex-col z-[70] transition-transform duration-500 ease-in-out
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Mobile Header with Close Button */}
        <div className="flex items-start justify-between py-10 px-8">
          <div>
            <h2 className="font-headline text-2xl italic text-on-surface tracking-tight leading-none">
              DevPulse
            </h2>
            <p className="font-body uppercase tracking-[0.3em] text-[9px] text-primary/60 mt-2 font-bold leading-none">
              Developer Intel
            </p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 -mr-2 rounded-xl text-stone-400 hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <nav className="flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.label}
                href={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 py-5 pl-8 pr-6 border-l-2 transition-all font-body uppercase tracking-[0.2em] text-[10px] ${
                  isActive
                    ? "text-on-surface font-black border-primary bg-surface-container shadow-sm"
                    : "text-on-surface-variant/60 hover:text-on-surface hover:bg-stone-50 border-transparent"
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-8 pb-12">
          <div className="pt-8 border-t border-outline-variant/5">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/20">
              SYSTEM STABLE
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
