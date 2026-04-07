import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface ArticleProps {
  id: string;
  source: string;
  sourceName?: string;
  title: string;
  url: string;
  score: number;
  comments: number;
  publishedAt: string | Date;
  isTrending?: boolean;
  coverImage?: string;
}

export function ArticleCard({
  source,
  sourceName,
  title,
  url,
  score,
  comments,
  publishedAt,
  isTrending,
  coverImage,
}: ArticleProps) {
  const getSourceDisplay = () => {
    switch (source) {
      case "reddit":
        return {
          label: sourceName || "r/programming",
          color: "bg-primary-container text-on-primary-container",
        };
      case "hn":
        return {
          label: "Hacker News",
          color: "bg-tertiary-container text-on-tertiary-container",
        };
      case "devto":
        return { label: "daily.dev", color: "bg-[#e1e2e9] text-[#505257]" };
      case "hashnode":
        return {
          label: "Hashnode",
          color: "bg-secondary-container text-on-secondary-container",
        };
      case "rss":
        return {
          label: sourceName || "Feed",
          color: "bg-surface-container-highest text-on-surface-variant border border-outline-variant/30",
        };
      default:
        return { label: source, color: "bg-stone-100 text-stone-500" };
    }
  };

  const { label, color } = getSourceDisplay();

  return (
    <article className="group bg-transparent p-0 transition-all duration-300 flex items-start lg:items-center gap-6 lg:gap-14 border-none">
      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <span
            className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] rounded-none ${color}`}
          >
            {label}
          </span>
          <span className="text-[10px] text-on-surface-variant/40 font-black uppercase tracking-[0.3em] leading-none antialiased">
            {dayjs(publishedAt).fromNow()}
          </span>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-2xl lg:text-3xl font-semibold text-[#323233] leading-tight lg:leading-[1.1] group-hover:text-primary transition-colors cursor-pointer line-clamp-2 pr-6 tracking-tighter sm:tracking-tight"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          {title}
        </a>

        <div className="flex items-center gap-8 mt-6">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/40">
            <span className="material-symbols-outlined text-[14px]">
              chat_bubble
            </span>
            {comments} Comments
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/40 group-hover:text-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[14px]">
              expand_less
            </span>
            {score}
          </div>
        </div>
      </div>

      {/* Right Side Image (Journal Style - fixed width responsive) */}
      {coverImage && (
        <div className="w-24 h-24 lg:w-64 lg:h-48 bg-surface-container-high overflow-hidden shrink-0 hidden sm:block border-l border-outline-variant/5">
          <img
            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            alt={title}
            src={coverImage}
          />
        </div>
      )}
    </article>
  );
}
