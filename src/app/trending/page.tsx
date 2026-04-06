"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { ArticleCard } from "@/components/dashboard/ArticleCard";
import { useSearchParams } from "next/navigation";

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

type Pagination = {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
};

function TrendingContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Filters
  const [sources, setSources] = useState<string[]>([
    "reddit",
    "hn",
    "devto",
    "hashnode",
  ]);
  const [timeframe, setTimeframe] = useState("all");
  const [sort, setSort] = useState("trending");

  const observer = useRef<IntersectionObserver | null>(null);
  const lastArticleRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination?.hasMore) {
          fetchArticles(pagination.offset + pagination.limit);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, pagination],
  );

  const fetchArticles = async (offset = 0) => {
    setLoading(true);
    try {
      const sourcesParam = sources.join(",");
      const query = `/api/posts?limit=10&offset=${offset}&sources=${sourcesParam}&timeframe=${timeframe}&sort=${sort}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
      const res = await fetch(query);
      const data = await res.json();

      if (data.articles) {
        setArticles((prev) =>
          offset === 0 ? data.articles : [...prev, ...data.articles],
        );
        setPagination(data.pagination);
      }
    } catch (e) {
      console.error("Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(0);
  }, [sources, timeframe, sort, search]);

  const toggleSource = (src: string) => {
    setSources((prev) =>
      prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src],
    );
  };

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-8 lg:p-16 pt-24 lg:pt-32 max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-12 lg:mb-24">
            <p className="font-body text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-6 animate-in fade-in duration-700">
              AGGREGATED SIGNALS
            </p>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 lg:gap-20">
              <div className="flex-1 min-w-0">
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-semibold tracking-tighter text-on-surface mb-6 leading-tight sm:leading-[0.9] font-headline animate-in slide-in-from-bottom-2 duration-700 break-words">
                  {search ? `Searching: ${search}` : "DevPulse Intel."}
                </h2>
                <div className="flex items-center gap-4 mt-6">
                  <span className="w-8 sm:w-12 h-[1px] bg-outline-variant/30 shrink-0"></span>
                  <p className="text-on-surface-variant/70 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] truncate">
                    Curated High-Velocity Intelligence.
                  </p>
                </div>
              </div>

              <div className="flex bg-surface-container-low p-1 rounded-full border border-outline-variant/10 shadow-sm overflow-x-auto no-scrollbar max-w-full">
                {[
                  { id: "trending", label: "Trending" },
                  { id: "latest", label: "Latest" },
                  { id: "popular", label: "Popular" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSort(s.id)}
                    className={`px-4 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-[9px] sm:text-[10px] uppercase font-bold tracking-widest rounded-full transition-all border outline-none cursor-default shrink-0 ${
                      sort === s.id
                        ? "bg-white text-on-surface border-on-surface-variant/20 shadow-sm"
                        : "text-on-surface-variant/40 hover:text-on-surface border-transparent"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8 lg:gap-20 items-start">
            {/* STICKY Filters Aside */}
            <aside className="col-span-12 xl:col-span-3 sticky top-24 lg:top-32 self-start space-y-10 lg:space-y-16 z-40 bg-surface/80 backdrop-blur-3xl xl:bg-transparent xl:backdrop-blur-none py-4 xl:py-0 -mx-4 px-4 xl:mx-0 xl:px-0 border-b border-outline-variant/10 xl:border-none">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/20 mb-8 flex items-center gap-3">
                  NETWORK CHANNELS
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-1 gap-2.5">
                  {[
                    { id: "reddit", label: "Reddit", color: "bg-[#FF4500]" },
                    { id: "hn", label: "HN", color: "bg-[#FF6600]" },
                    { id: "devto", label: "daily.dev", color: "bg-[#717786]" },
                    { id: "hashnode", label: "Hashnode", color: "bg-primary" },
                  ].map((s) => (
                    <label
                      key={s.id}
                      className={`flex items-center gap-3 p-3.5 sm:p-4 lg:p-5 transition-all border border-outline-variant/10 rounded-xl font-body hover:bg-stone-50 cursor-default ${sources.includes(s.id) ? "opacity-100 bg-white" : "opacity-30 grayscale"}`}
                    >
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 rounded text-on-surface border-stone-300 focus:ring-0 cursor-default"
                        checked={sources.includes(s.id)}
                        onChange={() => toggleSource(s.id)}
                      />
                      <span className="text-[9px] font-black text-on-surface uppercase tracking-widest leading-none truncate">
                        {s.label}
                      </span>
                      <span
                        className={`ml-auto w-1 h-1 rounded-full shrink-0 ${s.color}`}
                      ></span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="hidden xl:block">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/20 mb-8">
                  TIME HORIZON
                </h4>
                <div className="grid grid-cols-4 xl:grid-cols-2 gap-2">
                  {[
                    { id: "24h", label: "24h" },
                    { id: "7d", label: "7d" },
                    { id: "30d", label: "30d" },
                    { id: "all", label: "All" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTimeframe(t.id)}
                      className={`py-3 sm:py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border cursor-default outline-none break-all ${
                        timeframe === t.id
                          ? "bg-surface-container text-on-surface border-on-surface-variant/20 shadow-sm"
                          : "bg-surface-container-low text-on-surface-variant/40 hover:bg-stone-100 border-transparent"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Responsive Feed Section */}
            <section className="col-span-12 xl:col-span-9 space-y-12 lg:space-y-24">
              {/* Mobile Time Horizon (Sticky) */}
              <div className="xl:hidden sticky top-24 z-[35] bg-surface/95 backdrop-blur-sm py-4 border-b border-outline-variant/10 -mx-4 px-4 mb-8">
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {[
                      { id: "24h", label: "24h" },
                      { id: "7d", label: "7d" },
                      { id: "30d", label: "30d" },
                      { id: "all", label: "All" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTimeframe(t.id)}
                        className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border cursor-default outline-none whitespace-nowrap ${
                          timeframe === t.id
                            ? "bg-on-surface text-surface border-on-surface shadow-sm"
                            : "bg-surface text-on-surface-variant/40 border-outline-variant/20"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
              </div>

              {articles.map((art, index) => (
                <div
                  key={art.id}
                  ref={index === articles.length - 1 ? lastArticleRef : null}
                >
                  <ArticleCard 
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
                </div>
              ))}

              {loading && (
                <div className="space-y-12">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-44 sm:h-64 bg-surface-container-low animate-pulse rounded-2xl"
                    />
                  ))}
                </div>
              )}

              {!pagination?.hasMore && articles.length > 0 && (
                <div className="text-center py-24 sm:py-32 text-on-surface-variant/20 font-black uppercase tracking-[0.5em] text-[9px] italic border-t border-outline-variant/10">
                  EDGE OF THE INTERNET.
                </div>
              )}

              {articles.length === 0 && !loading && (
                <div className="text-center py-32 sm:py-40 bg-surface-container-low rounded-2xl p-6">
                  <p className="text-3xl sm:text-5xl font-semibold text-on-surface-variant/10 tracking-tighter italic font-headline">
                    Quiet Orbit.
                  </p>
                  <p className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-8">
                    ADJUST SIGNALS TO FIND MORE DEVPULSE INTELLIGENCE.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TrendingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center font-black uppercase tracking-widest text-[9px] opacity-20">
          SYNCING DEVPULSE...
        </div>
      }
    >
      <TrendingContent />
    </Suspense>
  );
}
