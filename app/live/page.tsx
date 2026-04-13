import { LiveScoreBoard } from "@/components/live/live-score-board";
import { PageBanner } from "@/components/page-banner";
import { getMatches } from "@/lib/data";

import styles from "@/app/subpage.module.css";

export const dynamic = "force-dynamic";

export default async function LivePage() {
  const matches = await getMatches();

  return (
    <div className={styles.page}>
      <PageBanner
        chips={["Live scores", "Matchday", "UDGAM 2026"]}
        description="Follow score updates from ongoing UDGAM 2026 matches across all venues."
        eyebrow="UDGAM live"
        title="Live Scores"
      />
      <LiveScoreBoard initialMatches={matches} />
    </div>
  );
}
