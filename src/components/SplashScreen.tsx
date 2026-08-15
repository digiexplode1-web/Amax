import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Check if desktop screen (width >= 768px)
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

  useEffect(() => {
    if (isDesktop) {
      if (onComplete) onComplete();
      return;
    }

    const mountTimer = setTimeout(() => setMounted(true), 50);

    // 3-second progress fill animation (30ms x 100 = 3000ms = 3.0s)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleFinish();
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => {
      clearTimeout(mountTimer);
      clearInterval(interval);
    };
  }, [isDesktop]);

  const handleFinish = () => {
    setFadeOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 400);
  };

  const handleClickToSkip = () => {
    setProgress(100);
    handleFinish();
  };

  if (isDesktop) {
    return null;
  }

  return (
    <div
      onClick={handleClickToSkip}
      className={`fixed inset-0 z-[9999] w-screen h-screen bg-[#0D0B0A] text-white md:hidden flex flex-col items-center justify-between transition-opacity duration-400 select-none cursor-pointer overflow-hidden ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      title="Tap to skip"
    >
      {/* 1 & 6. Full Screen Edge-to-Edge Artwork (NO Poster Frame / NO Black Margins) */}
      <img
        src="/splash_screen.jpg"
        alt="Amax Craft Luxury Splash Screen"
        className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-transform duration-1000 ease-out ${
          mounted ? 'scale-100' : 'scale-[1.04]'
        }`}
      />

      {/* Subtle Ambient Vignette for Superior Text & Loader Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

      {/* 2 & 3 & 4. Loading Section Positioned Directly Below Logo Section */}
      <div className="relative z-10 w-full flex flex-col items-center justify-end h-full pb-16 sm:pb-24 px-6 space-y-3 pointer-events-none">
        
        {/* Premium Thin Gold Metallic Rounded Bar with Soft Glow */}
        <div className="w-64 max-w-[72vw] h-2.5 sm:h-3 bg-black/80 rounded-full border border-[#D4AF37]/60 p-0.5 shadow-2xl backdrop-blur-md relative overflow-hidden ring-1 ring-[#D4AF37]/20">
          <div
            className="h-full bg-gradient-to-r from-[#751C2F] via-[#C7953E] to-[#F3E5AB] rounded-full transition-all duration-75 shadow-md relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            {/* Gold Shimmer Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* 5. Bottom Subtitle: FORGED FOR EXCELLENCE */}
        <p className="font-serif text-[10px] sm:text-xs font-semibold text-[#D4AF37]/90 tracking-[0.35em] uppercase drop-shadow-md animate-pulse">
          FORGED FOR EXCELLENCE
        </p>

      </div>
    </div>
  );
};
