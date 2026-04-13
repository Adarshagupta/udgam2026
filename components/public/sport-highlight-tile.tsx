import type { CSSProperties } from "react";

import {
  PatternedPanel,
  type PanelPattern,
} from "@/components/public/patterned-panel";
import styles from "@/components/public/public-ui.module.css";

interface SportHighlightTileProps {
  title: string;
  text: string;
  label: string;
  accent: string;
  imageUrl?: string | null;
  meta?: string;
  pattern?: PanelPattern;
  className?: string;
}

export function SportHighlightTile({
  title,
  text,
  label,
  accent,
  imageUrl,
  meta,
  pattern = "grid",
  className,
}: SportHighlightTileProps) {
  return (
    <PatternedPanel
      as="article"
      className={[
        styles.tile,
        imageUrl ? styles.tileWithImage : "",
        className ?? "",
      ]
        .join(" ")
        .trim()}
      pattern={pattern}
      tone="neutral"
    >
      {imageUrl ? (
        <div
          aria-hidden="true"
          className={styles.tileMedia}
          style={{ backgroundImage: `url(${imageUrl})` } as CSSProperties}
        />
      ) : null}
      <span className={styles.tileLabel}>{label}</span>
      <div
        className={styles.tileAccent}
        style={{ "--tile-accent": accent } as CSSProperties}
      />
      {meta ? <span className={styles.tileMeta}>{meta}</span> : null}
      <h3 className={styles.tileTitle}>{title}</h3>
      <p className={styles.tileText}>{text}</p>
    </PatternedPanel>
  );
}
