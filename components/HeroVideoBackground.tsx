export default function HeroVideoBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <video
        src="/videos/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
