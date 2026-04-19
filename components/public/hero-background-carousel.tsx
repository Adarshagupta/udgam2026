"use client";

import { useEffect, useState } from "react";

import styles from "@/app/page.module.css";

const localHeroVideo = "/hero/heroo.mp4";

const localHeroImages = [
  "/hero/image.png",
  "/hero/Screenshot%202026-04-12%20182400.png",
] as const;

const fallbackHeroImages = [
  "https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg?auto=compress&cs=tinysrgb&w=1800",
  "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1800",
] as const;

interface HeroBackgroundCarouselProps {
  className?: string;
}

export function HeroBackgroundCarousel({ className = "" }: HeroBackgroundCarouselProps) {
  const [heroImages, setHeroImages] = useState<string[]>([...fallbackHeroImages]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [useVideoBackground, setUseVideoBackground] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function loadLocalImages() {
      const checks = await Promise.all(
        localHeroImages.map(
          (imageUrl) =>
            new Promise<string | null>((resolve) => {
              const image = new Image();
              image.onload = () => resolve(imageUrl);
              image.onerror = () => resolve(null);
              image.src = imageUrl;
            }),
        ),
      );

      if (isCancelled) {
        return;
      }

      const validLocalImages = checks.filter((imageUrl): imageUrl is string => Boolean(imageUrl));
      if (validLocalImages.length > 0) {
        setHeroImages(validLocalImages);
        setActiveIndex(0);
      }
    }

    void loadLocalImages();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (useVideoBackground) {
      return;
    }

    if (heroImages.length === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [heroImages, useVideoBackground]);

  return (
    <div className={`${styles.heroBackdrop} ${className}`.trim()} aria-hidden="true">
      {useVideoBackground ? (
        <video
          autoPlay
          className={styles.heroBackdropVideo}
          loop
          muted
          onError={() => setUseVideoBackground(false)}
          playsInline
          preload="metadata"
        >
          <source src={localHeroVideo} type="video/mp4" />
        </video>
      ) : (
        heroImages.map((imageUrl, index) => (
          <div
            className={`${styles.heroBackdropSlide} ${
              index === activeIndex ? styles.heroBackdropSlideActive : ""
            }`.trim()}
            key={imageUrl}
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        ))
      )}
    </div>
  );
}
