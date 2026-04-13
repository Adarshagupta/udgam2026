import { PageBanner } from "@/components/page-banner";
import { getContentPosts } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";

import styles from "@/app/subpage.module.css";

export const dynamic = "force-dynamic";

export default async function UpdatesPage() {
  const posts = await getContentPosts({ publishedOnly: true });

  return (
    <div className={styles.page}>
      <PageBanner
        chips={["Blog", "News", "Sports stories"]}
        description="Official announcements, match highlights, and stories from UDGAM 2026."
        eyebrow="UDGAM updates"
        title="Blog & News"
      />

      <div className={styles.gridTwo}>
        {posts.length ? (
          posts.map((post, index) => (
            <article
              className={index % 3 === 0 ? styles.darkCard : styles.card}
              key={post.id}
            >
              <p className={index % 3 === 0 ? styles.darkEyebrow : styles.eyebrow}>
                {post.type} {post.sportName ? `· ${post.sportName}` : "· UDGAM 2026"}
              </p>
              <h2 className={styles.title}>{post.title}</h2>
              <p className={index % 3 === 0 ? styles.darkText : styles.text}>
                {post.summary}
              </p>
              <p className={index % 3 === 0 ? styles.darkText : styles.text}>{post.body}</p>
              <div className={styles.metaRow}>
                <span>{post.authorName ?? "UDGAM Team"}</span>
                <span>{formatDateTime(post.publishedAt ?? post.createdAt)}</span>
              </div>
            </article>
          ))
        ) : (
          <article className={styles.card}>
            <p className={styles.eyebrow}>Updates</p>
            <h2 className={styles.title}>No published posts yet.</h2>
            <p className={styles.text}>
              Blog posts and sports announcements will appear here as soon as they are published.
            </p>
          </article>
        )}
      </div>
    </div>
  );
}
