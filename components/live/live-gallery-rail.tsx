"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { io } from "socket.io-client";

import type { GalleryItem } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

import styles from "@/components/live/live.module.css";

interface LiveGalleryRailProps {
  initialImages: GalleryItem[];
  compact?: boolean;
}

export function LiveGalleryRail({
  initialImages,
  compact = false,
}: LiveGalleryRailProps) {
  const [images, setImages] = useState(initialImages);
  const deferredImages = useDeferredValue(images);

  useEffect(() => {
    const socket = io({
      path: "/api/socket/io",
    });

    socket.on("gallery:update", (payload: GalleryItem[]) => setImages(payload));

    return () => {
      socket.disconnect();
    };
  }, []);

  const visibleImages = compact ? deferredImages.slice(0, 2) : deferredImages;
  const title = compact ? "Gallery" : "Live Gallery";
  const hint = compact
    ? "Desk uploads land here."
    : "New frames land here the moment the desk uploads them.";

  return (
    <section
      className={`${styles.card} ${styles.galleryRailRoot} ${compact ? styles.compactCard : ""}`.trim()}
    >
      {compact ? (
        <div className={styles.slimHeader}>
          <div>
            <span className={styles.slimLabel}>Gallery rail</span>
            <p className={styles.slimHint}>Fresh uploads from the live desk.</p>
          </div>
          <span className={styles.statusPill}>{visibleImages.length} frames</span>
        </div>
      ) : (
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>{title}</h3>
          </div>
          <span className={styles.statusPill}>{visibleImages.length} frames</span>
        </div>
      )}

      {visibleImages.length ? (
        <div className={compact ? styles.gridCompact : styles.grid}>
          {visibleImages.map((image) => (
            <article className={styles.galleryCard} key={image.id}>
              <div className={styles.galleryMedia}>
                <img alt={image.title} className={styles.galleryImage} src={image.url} />
              </div>
              <div className={styles.galleryOverlay}>
                <p className={styles.galleryTitle}>{image.title}</p>
                <p className={styles.galleryCaption}>{image.caption}</p>
                <span className={styles.galleryDate}>{formatDateTime(image.createdAt)}</span>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
