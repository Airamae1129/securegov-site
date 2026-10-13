import { overviewVideo } from "@/content";

// Native player: one compressed 1080p MP4 + poster from /public/video. Nothing loads until play.
export function OverviewVideo({ autoPlay = false, className = "" }: { autoPlay?: boolean; className?: string }) {
  return (
    <video
      data-testid="overview-video"
      className={`aspect-video w-full bg-sg-ink-950 ${className}`}
      src={overviewVideo.src}
      poster={overviewVideo.poster}
      controls
      playsInline
      autoPlay={autoPlay}
      preload={autoPlay ? "auto" : "none"}
      aria-label={overviewVideo.title}
    />
  );
}
