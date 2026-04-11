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
        chips={["Blog", "News", "Organizer notes"]}
        description="Official notices, behind-the-scenes dispatches, and match-day stories from the festival desk."
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
                {post.type} {post.sportName ? `· ${post.sportName}` : "· UDGAM Desk"}
              </p>
              <h2 className={styles.title}>{post.title}</h2>
              <p className={index % 3 === 0 ? styles.darkText : styles.text}>
                {post.summary}
              </p>
              <p className={index % 3 === 0 ? styles.darkText : styles.text}>{post.body}</p>
              <div className={styles.metaRow}>
                <span>{post.authorName ?? "UDGAM Desk"}</span>
                <span>{formatDateTime(post.publishedAt ?? post.createdAt)}</span>
              </div>
            </article>
          ))
        ) : (
          <article className={styles.card}>
            <p className={styles.eyebrow}>Updates</p>
            <h2 className={styles.title}>No published posts yet.</h2>
            <p className={styles.text}>
              Blog posts and news notices will appear here as soon as the admin desk
              publishes them.
            </p>
          </article>
        )}
      </div>
    </div>
  );
}
