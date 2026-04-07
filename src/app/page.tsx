"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { ArticleCard } from "@/components/dashboard/ArticleCard";

type Article = {
  id: string;
  source: { name: string };
  sourceName?: string;
  title: string;
  url: string;
  score: number;
  rawScore: number;
  commentsCount: number;
  publishedAt: string;
  isTrending: boolean;
  coverImage?: string;
};

function DashboardContent() {
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [greeting, setGreeting] = useState("Morning");

  const fetchSummaryArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?limit=3&sort=trending&timeframe=24h`);
      const data = await res.json();
      if (data.articles) {
        setTrendingArticles(data.articles);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryArticles();

    // Dynamic Greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Morning");
    else if (hour < 17) setGreeting("Afternoon");
    else setGreeting("Evening");
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

      <main className="lg:ml-64 p-6 sm:p-10 lg:p-16 pt-24 lg:pt-32 max-w-7xl mx-auto font-sans tracking-tight">
        {/* Dashboard Greeting Section */}
        <section className="max-w-6xl mx-auto mb-16 lg:mb-28">
          <p className="font-body text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-6 animate-in fade-in duration-700">
            DAILY INTELLIGENCE BRIEFING
          </p>
          <h2 className="text-5xl sm:text-6xl font-semibold tracking-tighter text-[#323233] mb-8 leading-[0.9] font-headline animate-in slide-in-from-bottom-2 duration-700">
            {greeting}.
          </h2>
          <p className="text-on-surface-variant max-w-lg mt-10 leading-relaxed font-body italic border-l-2 border-primary/20 pl-8 py-3 opacity-80 hover:opacity-100 transition-opacity">
            Today’s signal is exceptionally strong in decentralized identity and
            edge computing architectures. Here is your curated synthesis from
            DevPulse.
          </p>
        </section>

        <div className="max-w-6xl mx-auto">
          {/* Primary Feed Section */}
          <div className="mb-20 lg:mb-32">
            <div className="flex items-center justify-between mb-16 lg:mb-20">
              <h3 className="text-3xl font-semibold tracking-tighter text-[#323233] font-headline italic leading-none">
                Trending Right Now
              </h3>
              <Link
                href="/trending"
                className="font-body text-[10px] font-bold uppercase tracking-[0.3em] text-primary hover:underline decoration-primary/30 transition-all font-sans flex items-center gap-2"
              >
                <span className="hidden sm:inline">View All Intelligence</span>
                <span className="material-symbols-outlined text-lg sm:text-[14px]">
                  arrow_forward
                </span>
              </Link>
            </div>

            {loading ? (
              <div className="space-y-12">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-44 bg-surface-container-low animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-16 lg:space-y-24">
                {trendingArticles.map((art) => (
                  <ArticleCard
                    key={art.id}
                    id={art.id}
                    source={art.source.name}
                    sourceName={art.sourceName}
                    title={art.title}
                    url={art.url}
                    score={art.rawScore}
                    comments={art.commentsCount}
                    publishedAt={art.publishedAt}
                    isTrending={art.isTrending}
                    coverImage={art.coverImage}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="lg:ml-64 py-12 lg:py-16 px-10 border-t border-outline-variant/10 bg-[#e4e2e2] flex flex-col sm:flex-row justify-between items-center gap-10 text-[9px] font-bold tracking-[0.3em] uppercase text-[#545f72] antialiased">
        <div className="flex gap-10 order-2 sm:order-1">
          <a
            href="#"
            className="hover:text-primary transition-colors underline decoration-outline-variant/20 cursor-pointer"
          >
            Documentation
          </a>
          <a
            href="#"
            className="hover:text-primary transition-colors underline decoration-outline-variant/20 cursor-pointer"
          >
            Status
          </a>
          <a
            href="#"
            className="hover:text-primary transition-colors underline decoration-outline-variant/20 cursor-pointer"
          >
            Support
          </a>
        </div>
        <div className="order-1 sm:order-2 opacity-50">
          © 2026 DevPulse Intelligence
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center opacity-30 font-black uppercase tracking-[0.4em] text-[10px]">
          SYNCING SIGNALS...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
