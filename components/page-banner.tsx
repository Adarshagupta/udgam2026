import { ParallaxScene } from "@/components/public/parallax-scene";
import {
  PatternedPanel,
  type PanelPattern,
  type PanelTone,
} from "@/components/public/patterned-panel";
import panelStyles from "@/components/public/public-ui.module.css";
import styles from "@/components/site.module.css";

interface PageBannerProps {
  eyebrow: string;
  title: string;
  description: string;
  chips: string[];
  tone?: PanelTone;
  pattern?: PanelPattern;
  compact?: boolean;
}

export function PageBanner({
  eyebrow,
  title,
  description,
  chips,
  tone = "dark",
  pattern = "court",
  compact = false,
}: PageBannerProps) {
  return (
    <ParallaxScene className={panelStyles.bannerWrap} strength={12}>
      <PatternedPanel
        as="section"
        className={`${panelStyles.bannerPanel} ${compact ? panelStyles.bannerPanelCompact : ""}`}
        pattern={pattern}
        tone={tone}
      >
        <p className={`${panelStyles.bannerEyebrow} ${compact ? panelStyles.bannerEyebrowCompact : ""}`}>
          {eyebrow}
        </p>
        <h1 className={`${styles.bannerTitle} ${compact ? styles.bannerTitleCompact : ""}`}>
          {title}
        </h1>
        <p className={`${styles.bannerText} ${compact ? styles.bannerTextCompact : ""}`}>
          {description}
        </p>
        <div className={`${styles.chips} ${compact ? styles.chipsCompact : ""}`}>
          {chips.map((chip) => (
            <span
              key={chip}
              className={`${styles.chip} ${compact ? styles.chipCompact : ""}`}
            >
              {chip}
            </span>
          ))}
        </div>
      </PatternedPanel>
    </ParallaxScene>
  );
}
