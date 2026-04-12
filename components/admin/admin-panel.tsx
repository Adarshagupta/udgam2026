"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import type { DashboardSnapshot, LiveMatch } from "@/lib/types";
import { galleryFileInputAccept, galleryImageFormatLabel } from "@/lib/gallery-upload";
import { formatDateTime } from "@/lib/utils";
import type { AdminView } from "@/components/admin/config";

import styles from "@/components/admin/admin.module.css";

interface AdminPanelProps {
  snapshot: DashboardSnapshot;
  userName?: string;
  focusedSection?: AdminView;
  hideSidebar?: boolean;
}

const navItems = [
  { id: "overview", label: "Overview", meta: "Summary" },
  { id: "sports", label: "Sports", meta: "Create" },
  { id: "teams", label: "Teams", meta: "Roster" },
  { id: "updates", label: "Blog & News", meta: "Publish" },
  { id: "fixtures", label: "Fixtures", meta: "Schedule" },
  { id: "scores", label: "Scores", meta: "Live" },
  { id: "gallery", label: "Gallery", meta: "Media" },
  { id: "registrations", label: "Registrations", meta: "Committee" },
] as const;

const requiredR2EnvVars = [
  "R2_ACCOUNT_ID",
  "R2_BUCKET",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
] as const;

export function AdminPanel({
  snapshot,
  userName,
  focusedSection,
  hideSidebar = false,
}: AdminPanelProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busyAction, setBusyAction] = useState<string | null>(null);

  async function handleCreateSport(formData: FormData) {
    setBusyAction("sport");
    setMessage("");

    const payload = {
      name: String(formData.get("name") ?? ""),
      accent: String(formData.get("accent") ?? ""),
      tagline: String(formData.get("tagline") ?? ""),
      imageUrl: String(formData.get("imageUrl") ?? ""),
    };

    const response = await fetch("/api/admin/sports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const responsePayload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    setBusyAction(null);

    if (!response.ok) {
      setMessage(responsePayload?.error ?? "Could not create the sport.");
      return;
    }

    setMessage(`Added ${payload.name} to the sports desk.`);
    startTransition(() => router.refresh());
  }

  async function handleUpdateSport(
    sportId: string,
    formData: FormData,
    sportName: string,
  ) {
    setBusyAction("sport-" + sportId);
    setMessage("");

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      accent: String(formData.get("accent") ?? "").trim(),
      imageUrl: String(formData.get("imageUrl") ?? "").trim(),
      tagline: String(formData.get("tagline") ?? "").trim(),
    };

    const response = await fetch("/api/admin/sports/" + sportId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const responsePayload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    setBusyAction(null);

    if (!response.ok) {
      setMessage(responsePayload?.error ?? ("Could not update " + sportName + "."));
      return;
    }

    setMessage(payload.name + " updated.");
    startTransition(() => router.refresh());
  }
  async function handleCreateTeam(formData: FormData) {
    setBusyAction("team");
    setMessage("");

    const payload = {
      name: String(formData.get("name") ?? ""),
      shortName: String(formData.get("shortName") ?? ""),
      institution: String(formData.get("institution") ?? ""),
      sportId: String(formData.get("sportId") ?? ""),
    };

    const response = await fetch("/api/admin/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const responsePayload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    setBusyAction(null);

    if (!response.ok) {
      setMessage(responsePayload?.error ?? "Could not create the team.");
      return;
    }

    setMessage(`Added ${payload.name} to the teams list.`);
    startTransition(() => router.refresh());
  }

  async function handleCreatePost(formData: FormData) {
    setBusyAction("post");
    setMessage("");

    const payload = {
      type: String(formData.get("type") ?? "NEWS"),
      title: String(formData.get("title") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      body: String(formData.get("body") ?? ""),
      sportId: String(formData.get("sportId") ?? ""),
      published: formData.get("published") === "on",
    };

    const response = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const responsePayload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    setBusyAction(null);

    if (!response.ok) {
      setMessage(responsePayload?.error ?? "Could not publish the update.");
      return;
    }

    setMessage(`${payload.type === "BLOG" ? "Blog" : "News"} post saved.`);
    startTransition(() => router.refresh());
  }

  async function handleCreateMatch(formData: FormData) {
    setBusyAction("match");
    setMessage("");

    const rawStartsAt = String(formData.get("startsAt") ?? "");
    const payload = {
      sportId: String(formData.get("sportId") ?? ""),
      eventTitle: String(formData.get("eventTitle") ?? ""),
      homeTeamId: String(formData.get("homeTeamId") ?? ""),
      awayTeamId: String(formData.get("awayTeamId") ?? ""),
      venue: String(formData.get("venue") ?? ""),
      startsAt: rawStartsAt ? new Date(rawStartsAt).toISOString() : "",
      status: String(formData.get("status") ?? "SCHEDULED"),
      featured: formData.get("featured") === "on",
    };

    const response = await fetch("/api/admin/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const responsePayload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    setBusyAction(null);

    if (!response.ok) {
      setMessage(responsePayload?.error ?? "Could not create the match card.");
      return;
    }

    setMessage("Match published to the live board.");
    startTransition(() => router.refresh());
  }

  async function handleUpdateMatch(match: LiveMatch, formData: FormData) {
    setBusyAction(`match-${match.id}`);
    setMessage("");

    const payload = {
      homeScore: Number(formData.get("homeScore") ?? 0),
      awayScore: Number(formData.get("awayScore") ?? 0),
      status: String(formData.get("status") ?? match.status),
      featured: formData.get("featured") === "on",
    };

    const response = await fetch(`/api/admin/matches/${match.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const responsePayload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    setBusyAction(null);

    if (!response.ok) {
      setMessage(
        responsePayload?.error ?? `Could not update ${match.homeTeam} vs ${match.awayTeam}.`,
      );
      return;
    }

    setMessage(`Updated ${match.homeTeam} vs ${match.awayTeam}.`);
    startTransition(() => router.refresh());
  }

  async function handleUpload(formData: FormData) {
    setBusyAction("gallery");
    setMessage("");

    const response = await fetch("/api/admin/gallery", {
      method: "POST",
      body: formData,
    });
    const responsePayload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    setBusyAction(null);

    if (!response.ok) {
      setMessage(responsePayload?.error ?? "Upload failed.");
      return;
    }

    setMessage("Frame pushed to the live gallery.");
    startTransition(() => router.refresh());
  }

  async function handleUpdateRegistration(
    registrationId: string,
    formData: FormData,
    registrationTitle: string,
  ) {
    setBusyAction(`registration-${registrationId}`);
    setMessage("");

    const response = await fetch(`/api/admin/registrations/${registrationId}`, {
      method: "PATCH",
      body: formData,
    });
    const responsePayload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    setBusyAction(null);

    if (!response.ok) {
      setMessage(responsePayload?.error ?? `Could not update ${registrationTitle}.`);
      return;
    }

    setMessage(`${registrationTitle} updated.`);
    startTransition(() => router.refresh());
  }

  const canCreateMatch = snapshot.sports.length > 0 && snapshot.teams.length > 1;
  const showAllSections = !focusedSection;
  const showSection = (sectionId: AdminView) => showAllSections || focusedSection === sectionId;
  const displayName = userName ?? "Organizer";
  const liveMatchesCount = snapshot.matches.filter((match) => match.status === "LIVE").length;
  const featuredMatchesCount = snapshot.matches.filter((match) => match.featured).length;
  const featuredGalleryCount = snapshot.gallery.filter((image) => image.featured).length;
  const publishedPostCount = snapshot.posts.filter((post) => post.published).length;
  const latestRegistration = snapshot.committeeRegistrations[0] ?? null;
  const panelShellClass = hideSidebar ? styles.dashboardEmbedded : styles.dashboard;
  const panelWorkspaceClass = hideSidebar ? styles.panelWorkspaceSolo : styles.panelWorkspace;

  return (
    <div className={panelShellClass}>
      {!hideSidebar ? (
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTop}>
            <p className={styles.sidebarEyebrow}>UDGAM ADMIN</p>
            <h1 className={styles.sidebarTitle}>Control Room</h1>
            <p className={styles.sidebarText}>
              A dedicated back-office workspace for festival operations.
            </p>
          </div>

          <nav className={styles.sidebarNav} aria-label="Admin sections">
            {navItems.map((item) => (
              <Link className={styles.sidebarNavItem} href={`/admin/${item.id}`} key={item.id}>
                <span className={styles.sidebarNavLabel}>{item.label}</span>
                <span className={styles.sidebarNavMeta}>{item.meta}</span>
              </Link>
            ))}
          </nav>

          <div className={styles.sidebarStatus}>
            <article className={styles.statusCard}>
              <span className={styles.statusLabel}>Signed in as</span>
              <strong className={styles.statusValue}>{displayName}</strong>
            </article>
            <article className={styles.statusCard}>
              <span className={styles.statusLabel}>Database</span>
              <strong className={styles.statusValue}>
                {snapshot.demoMode ? "Demo mode" : "PostgreSQL"}
              </strong>
            </article>
            <article className={styles.statusCard}>
              <span className={styles.statusLabel}>Media</span>
              <strong className={styles.statusValue}>
                {snapshot.r2Configured ? "R2 ready" : "Fallback"}
              </strong>
            </article>
          </div>

          <div className={styles.sidebarActions}>
            <Link className={styles.sidebarAction} href="/">
              Public home
            </Link>
            <Link className={styles.sidebarAction} href="/updates">
              Updates feed
            </Link>
            <Link className={styles.sidebarAction} href="/live">
              Live board
            </Link>
          </div>

          <button
            className={styles.sidebarLogout}
            onClick={() => void signOut({ callbackUrl: "/admin" })}
            type="button"
          >
            Log out
          </button>
        </aside>
      ) : null}

      <div className={panelWorkspaceClass}>
        {showSection("overview") ? (
        <section className={styles.hero} id="overview">
          <div className={styles.heroLayout}>
            <div className={styles.heroCopy}>
              <p className={styles.sectionEyebrow}>Dashboard overview</p>
              <h2 className={styles.heroTitle}>Operations overview</h2>
              <p className={styles.heroText}>Sports, scores, media, registrations.</p>
            </div>

            <div className={styles.heroRail}>
              <article className={styles.heroSignalCard}>
                <span className={styles.heroSignalLabel}>Live scoreboard</span>
                <strong className={styles.heroSignalValue}>{liveMatchesCount}</strong>
                <p className={styles.heroSignalMeta}>
                  {featuredMatchesCount
                    ? `${featuredMatchesCount} featured`
                    : "No featured cards"}
                </p>
              </article>

              <article className={styles.heroSignalCard}>
                <span className={styles.heroSignalLabel}>Content pulse</span>
                <strong className={styles.heroSignalValue}>
                  {publishedPostCount + featuredGalleryCount}
                </strong>
                <p className={styles.heroSignalMeta}>
                  {publishedPostCount} posts · {featuredGalleryCount} frames
                </p>
              </article>

              <article className={styles.heroSignalCard}>
                <span className={styles.heroSignalLabel}>Registration lane</span>
                <strong className={styles.heroSignalValue}>
                  {snapshot.committeeRegistrations.length}
                </strong>
                <p className={styles.heroSignalMeta}>
                  {latestRegistration
                    ? latestRegistration.title
                    : "No submissions yet"}
                </p>
              </article>
            </div>
          </div>

          {message ? <p className={styles.message}>{message}</p> : null}

          <div className={styles.statGrid}>
            <article className={styles.statCard}>
              <span className={styles.statLabel}>Sports</span>
              <strong className={styles.statValue}>{snapshot.sports.length}</strong>
            </article>
            <article className={styles.statCard}>
              <span className={styles.statLabel}>Teams</span>
              <strong className={styles.statValue}>{snapshot.teams.length}</strong>
            </article>
            <article className={styles.statCard}>
              <span className={styles.statLabel}>Posts</span>
              <strong className={styles.statValue}>{snapshot.posts.length}</strong>
            </article>
            <article className={styles.statCard}>
              <span className={styles.statLabel}>Matches</span>
              <strong className={styles.statValue}>{snapshot.matches.length}</strong>
            </article>
            <article className={styles.statCard}>
              <span className={styles.statLabel}>Gallery</span>
              <strong className={styles.statValue}>{snapshot.gallery.length}</strong>
            </article>
            <article className={styles.statCard}>
              <span className={styles.statLabel}>Committee Reg.</span>
              <strong className={styles.statValue}>{snapshot.committeeRegistrations.length}</strong>
            </article>
          </div>

          <div className={styles.alertStack}>
            {snapshot.demoMode ? (
              <div className={styles.hintBox}>
                Demo mode is active. Data will reset when the server restarts.
              </div>
            ) : null}

            {!snapshot.r2Configured ? (
              <div className={styles.warningBox}>
                Cloudflare R2 is not configured. Production gallery uploads still need
                storage keys.
              </div>
            ) : null}
          </div>
        </section>
        ) : null}

        {showSection("sports") ? (
        <section className={styles.section} id="sports">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Sports</p>
              <h3 className={styles.sectionTitle}>Competition categories</h3>
            </div>
          </div>

          <div className={styles.panelSplit}>
            <div className={styles.formPanel}>
              <form
                action={(formData) => {
                  void handleCreateSport(formData);
                }}
                className={styles.form}
              >
                <label className={styles.label}>
                  Sport name
                  <input className={styles.input} name="name" placeholder="Basketball" required />
                </label>
                <div className={styles.fieldGrid}>
                  <label className={styles.label}>
                    Accent
                    <input className={styles.input} name="accent" placeholder="#f35c38" />
                  </label>
                  <label className={styles.label}>
                    Tagline
                    <input
                      className={styles.input}
                      name="tagline"
                      placeholder="Fast cuts and loud finishes."
                    />
                  </label>
                </div>
                <label className={styles.label}>
                  Sport image URL
                  <input
                    className={styles.input}
                    name="imageUrl"
                    placeholder="https://example.com/basketball.jpg"
                  />
                </label>
                <div className={styles.buttonRow}>
                  <button
                    className={styles.primaryButton}
                    disabled={busyAction !== null}
                    type="submit"
                  >
                    {busyAction === "sport" ? "Saving..." : "Add sport"}
                  </button>
                </div>
              </form>
            </div>

            <div className={styles.listPanel}>
              <div className={styles.recordList}>
                {snapshot.sports.length ? (
                  snapshot.sports.map((sport) => (
                    <form
                      action={(formData) => {
                        void handleUpdateSport(sport.id, formData, sport.name);
                      }}
                      className={styles.listItem}
                      key={sport.id}
                    >
                      {sport.imageUrl ? (
                        <img alt={sport.name} className={styles.thumb} src={sport.imageUrl} />
                      ) : null}
                      <label className={styles.label}>
                        Name
                        <input
                          className={styles.input}
                          defaultValue={sport.name}
                          name="name"
                          required
                        />
                      </label>
                      <div className={styles.fieldGrid}>
                        <label className={styles.label}>
                          Accent
                          <input
                            className={styles.input}
                            defaultValue={sport.accent}
                            name="accent"
                            placeholder="#f35c38"
                          />
                        </label>
                        <label className={styles.label}>
                          Image URL
                          <input
                            className={styles.input}
                            defaultValue={sport.imageUrl ?? ""}
                            name="imageUrl"
                            placeholder="https://example.com/basketball.jpg"
                          />
                        </label>
                      </div>
                      <label className={styles.label}>
                        Tagline
                        <input
                          className={styles.input}
                          defaultValue={sport.tagline}
                          name="tagline"
                        />
                      </label>
                      <div className={styles.buttonRow}>
                        <button
                          className={styles.secondaryButton}
                          disabled={busyAction !== null}
                          type="submit"
                        >
                          {busyAction === ("sport-" + sport.id) ? "Saving..." : "Save changes"}
                        </button>
                      </div>
                    </form>
                  ))
                ) : (
                  <p className={styles.emptyState}>No sports created yet.</p>
                )}
              </div>
            </div>
          </div>
        </section>
        ) : null}

        {showSection("teams") ? (
        <section className={styles.section} id="teams">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Teams</p>
              <h3 className={styles.sectionTitle}>Build the roster</h3>
            </div>
          </div>

          <div className={styles.panelSplit}>
            <div className={styles.formPanel}>
              <form
                action={(formData) => {
                  void handleCreateTeam(formData);
                }}
                className={styles.form}
              >
                <div className={styles.fieldGrid}>
                  <label className={styles.label}>
                    Team name
                    <input
                      className={styles.input}
                      name="name"
                      placeholder="Falcon House"
                      required
                    />
                  </label>
                  <label className={styles.label}>
                    Short name
                    <input className={styles.input} maxLength={6} name="shortName" placeholder="FAL" />
                  </label>
                </div>

                <div className={styles.fieldGrid}>
                  <label className={styles.label}>
                    Institution
                    <input
                      className={styles.input}
                      name="institution"
                      placeholder="UDGAM University"
                    />
                  </label>
                  <label className={styles.label}>
                    Sport
                    <select className={styles.select} defaultValue="" name="sportId">
                      <option value="">Independent / choose later</option>
                      {snapshot.sports.map((sport) => (
                        <option key={sport.id} value={sport.id}>
                          {sport.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className={styles.buttonRow}>
                  <button
                    className={styles.primaryButton}
                    disabled={busyAction !== null}
                    type="submit"
                  >
                    {busyAction === "team" ? "Saving..." : "Add team"}
                  </button>
                </div>
              </form>
            </div>

            <div className={styles.listPanel}>
              <div className={styles.recordList}>
                {snapshot.teams.length ? (
                  snapshot.teams.map((team) => (
                    <article className={styles.listItem} key={team.id}>
                      <p className={styles.listTitle}>
                        {team.name} <span className={styles.inlineMeta}>({team.shortName})</span>
                      </p>
                      <p className={styles.listMeta}>
                        {team.sportName} · {team.institution}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className={styles.emptyState}>No teams created yet.</p>
                )}
              </div>
            </div>
          </div>
        </section>
        ) : null}

        {showSection("updates") ? (
        <section className={styles.section} id="updates">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Blog & News</p>
              <h3 className={styles.sectionTitle}>Publish updates</h3>
            </div>
          </div>

          <div className={styles.panelSplit}>
            <div className={styles.formPanel}>
              <form
                action={(formData) => {
                  void handleCreatePost(formData);
                }}
                className={styles.form}
              >
                <div className={styles.fieldGrid}>
                  <label className={styles.label}>
                    Type
                    <select className={styles.select} defaultValue="NEWS" name="type">
                      <option value="NEWS">News</option>
                      <option value="BLOG">Blog</option>
                    </select>
                  </label>
                  <label className={styles.label}>
                    Sport
                    <select className={styles.select} defaultValue="" name="sportId">
                      <option value="">All sports</option>
                      {snapshot.sports.map((sport) => (
                        <option key={sport.id} value={sport.id}>
                          {sport.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className={styles.label}>
                  Title
                  <input
                    className={styles.input}
                    name="title"
                    placeholder="Night Finals Traffic Plan"
                    required
                  />
                </label>

                <label className={styles.label}>
                  Summary
                  <textarea
                    className={styles.textarea}
                    name="summary"
                    placeholder="A quick summary for the public feed."
                    required
                  />
                </label>

                <label className={styles.label}>
                  Body
                  <textarea
                    className={`${styles.textarea} ${styles.textareaLarge}`}
                    name="body"
                    placeholder="Write the full update here."
                    required
                  />
                </label>

                <label className={styles.checkboxRow}>
                  <input defaultChecked name="published" type="checkbox" />
                  Publish immediately
                </label>

                <div className={styles.buttonRow}>
                  <button
                    className={styles.primaryButton}
                    disabled={busyAction !== null}
                    type="submit"
                  >
                    {busyAction === "post" ? "Saving..." : "Save update"}
                  </button>
                </div>
              </form>
            </div>

            <div className={styles.listPanel}>
              <div className={styles.recordList}>
                {snapshot.posts.length ? (
                  snapshot.posts.slice(0, 8).map((post) => (
                    <article className={styles.postCard} key={post.id}>
                      <div className={styles.postHeader}>
                        <span className={styles.postType}>{post.type}</span>
                        <span className={styles.listMeta}>
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className={styles.listTitle}>{post.title}</p>
                      <p className={styles.listMeta}>{post.summary}</p>
                      <p className={styles.listMeta}>
                        {post.sportName ?? "All sports"} ·{" "}
                        {formatDateTime(post.publishedAt ?? post.createdAt)}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className={styles.emptyState}>No posts published yet.</p>
                )}
              </div>
            </div>
          </div>
        </section>
        ) : null}

        {showSection("fixtures") ? (
        <section className={styles.section} id="fixtures">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Fixtures</p>
              <h3 className={styles.sectionTitle}>Publish match</h3>
            </div>
          </div>

          <div className={styles.panelSplit}>
            <div className={styles.formPanel}>
              <form
                action={(formData) => {
                  void handleCreateMatch(formData);
                }}
                className={styles.form}
              >
                <div className={styles.fieldGrid}>
                  <label className={styles.label}>
                    Sport
                    <select className={styles.select} defaultValue="" name="sportId" required>
                      <option value="" disabled>
                        Select sport
                      </option>
                      {snapshot.sports.map((sport) => (
                        <option key={sport.id} value={sport.id}>
                          {sport.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.label}>
                    Event title
                    <input
                      className={styles.input}
                      name="eventTitle"
                      placeholder="Night Finals"
                      required
                    />
                  </label>
                </div>

                <div className={styles.fieldGrid}>
                  <label className={styles.label}>
                    Home team
                    <select className={styles.select} defaultValue="" name="homeTeamId" required>
                      <option value="" disabled>
                        Select team
                      </option>
                      {snapshot.teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name} · {team.sportName}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.label}>
                    Away team
                    <select className={styles.select} defaultValue="" name="awayTeamId" required>
                      <option value="" disabled>
                        Select team
                      </option>
                      {snapshot.teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name} · {team.sportName}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className={styles.fieldGrid}>
                  <label className={styles.label}>
                    Venue
                    <input className={styles.input} name="venue" placeholder="Arena A" required />
                  </label>
                  <label className={styles.label}>
                    Starts at
                    <input className={styles.input} name="startsAt" required type="datetime-local" />
                  </label>
                </div>

                <div className={styles.fieldGrid}>
                  <label className={styles.label}>
                    Status
                    <select className={styles.select} defaultValue="SCHEDULED" name="status">
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="LIVE">Live</option>
                      <option value="HALFTIME">Halftime</option>
                      <option value="PAUSED">Paused</option>
                      <option value="FINAL">Final</option>
                    </select>
                  </label>
                  <label className={styles.checkboxRow}>
                    <input name="featured" type="checkbox" />
                    Feature on live board
                  </label>
                </div>

                {!canCreateMatch ? (
                  <p className={styles.supportText}>
                    Add at least one sport and two teams before publishing fixtures.
                  </p>
                ) : null}

                <div className={styles.buttonRow}>
                  <button
                    className={styles.primaryButton}
                    disabled={busyAction !== null || !canCreateMatch}
                    type="submit"
                  >
                    {busyAction === "match" ? "Publishing..." : "Publish match"}
                  </button>
                </div>
              </form>
            </div>

            <div className={styles.listPanel}>
              <div className={styles.recordList}>
                {snapshot.matches.length ? (
                  snapshot.matches.slice(0, 6).map((match) => (
                    <article className={styles.listItem} key={match.id}>
                      <p className={styles.listTitle}>
                        {match.homeTeam} vs {match.awayTeam}
                      </p>
                      <p className={styles.listMeta}>
                        {match.sport} · {match.venue}
                      </p>
                      <p className={styles.listMeta}>{formatDateTime(match.startsAt)}</p>
                    </article>
                  ))
                ) : (
                  <p className={styles.emptyState}>No fixtures published yet.</p>
                )}
              </div>
            </div>
          </div>
        </section>
        ) : null}

        {showSection("scores") ? (
        <section className={styles.section} id="scores">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Live scores</p>
              <h3 className={styles.sectionTitle}>Update active matches</h3>
            </div>
          </div>

          <div className={styles.recordList}>
            {snapshot.matches.length ? (
              snapshot.matches.map((match) => (
                <form
                  key={match.id}
                  action={(formData) => {
                    void handleUpdateMatch(match, formData);
                  }}
                  className={styles.matchCard}
                >
                  <div className={styles.matchHeader}>
                    <div>
                      <p className={styles.matchTitle}>
                        {match.homeTeam} vs {match.awayTeam}
                      </p>
                      <p className={styles.listMeta}>
                        {match.sport} · {match.venue} · {formatDateTime(match.startsAt)}
                      </p>
                    </div>
                    <span className={styles.matchStatus}>{match.status}</span>
                  </div>

                  <div className={styles.inlineGrid}>
                    <label className={styles.label}>
                      Home
                      <input
                        className={styles.input}
                        defaultValue={match.homeScore}
                        min="0"
                        name="homeScore"
                        type="number"
                      />
                    </label>
                    <label className={styles.label}>
                      Away
                      <input
                        className={styles.input}
                        defaultValue={match.awayScore}
                        min="0"
                        name="awayScore"
                        type="number"
                      />
                    </label>
                    <label className={styles.label}>
                      Status
                      <select className={styles.select} defaultValue={match.status} name="status">
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="LIVE">Live</option>
                        <option value="HALFTIME">Halftime</option>
                        <option value="PAUSED">Paused</option>
                        <option value="FINAL">Final</option>
                      </select>
                    </label>
                  </div>

                  <label className={styles.checkboxRow}>
                    <input defaultChecked={match.featured} name="featured" type="checkbox" />
                    Featured match
                  </label>

                  <div className={styles.buttonRow}>
                    <button
                      className={styles.secondaryButton}
                      disabled={busyAction !== null}
                      type="submit"
                    >
                      {busyAction === `match-${match.id}` ? "Saving..." : "Save update"}
                    </button>
                  </div>
                </form>
              ))
            ) : (
              <p className={styles.emptyState}>Matches will appear here after they are published.</p>
            )}
          </div>
        </section>
        ) : null}

        {showSection("gallery") ? (
        <section className={styles.section} id="gallery">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Gallery</p>
              <h3 className={styles.sectionTitle}>Upload media</h3>
            </div>
          </div>

          <div className={styles.panelSplit}>
            <div className={styles.formPanel}>
              <form
                action={(formData) => {
                  void handleUpload(formData);
                }}
                className={styles.form}
              >
                <label className={styles.label}>
                  Title
                  <input className={styles.input} name="title" placeholder="Arena Warmup" required />
                </label>
                <label className={styles.label}>
                  Caption
                  <textarea
                    className={styles.textarea}
                    name="caption"
                    placeholder="Sharp frame. Quick energy. Minimal words."
                  />
                </label>
                <div className={styles.fieldGrid}>
                  <label className={styles.label}>
                    Image file
                    <input
                      className={styles.input}
                      accept={galleryFileInputAccept}
                      name="file"
                      required
                      type="file"
                    />
                  </label>
                  <label className={styles.checkboxRow}>
                    <input defaultChecked name="featured" type="checkbox" />
                    Feature on homepage
                  </label>
                </div>

                <p className={styles.supportText}>
                  {galleryImageFormatLabel} up to {snapshot.r2MaxUploadSizeMb} MB.
                </p>

                <p className={styles.supportText}>
                  Served through the app unless <code>R2_PUBLIC_URL</code> is set.
                </p>

                {!snapshot.r2Configured ? (
                  <div className={styles.warningBox}>
                    Add{" "}
                    {requiredR2EnvVars.map((envVar, index) => (
                      <span key={envVar}>
                        {index > 0 ? ", " : null}
                        <code>{envVar}</code>
                      </span>
                    ))}{" "}
                    to <code>.env</code> or your deployment secrets. Set{" "}
                    <code>R2_PUBLIC_URL</code> only if you want direct public asset URLs.
                  </div>
                ) : null}

                <div className={styles.buttonRow}>
                  <button
                    className={styles.primaryButton}
                    disabled={busyAction !== null}
                    type="submit"
                  >
                    {busyAction === "gallery" ? "Uploading..." : "Push to gallery"}
                  </button>
                </div>
              </form>
            </div>

            <div className={styles.listPanel}>
              <div className={styles.recordList}>
                {snapshot.gallery.length ? (
                  snapshot.gallery.slice(0, 6).map((image) => (
                    <article className={styles.galleryCard} key={image.id}>
                      <img alt={image.title} className={styles.thumb} src={image.url} />
                      <div>
                        <p className={styles.listTitle}>{image.title}</p>
                        <p className={styles.listMeta}>{image.caption}</p>
                        <p className={styles.listMeta}>{formatDateTime(image.createdAt)}</p>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className={styles.emptyState}>Uploaded media will appear here.</p>
                )}
              </div>
            </div>
          </div>
        </section>
        ) : null}

        {showSection("registrations") ? (
        <section className={styles.section} id="registrations">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Registrations</p>
              <h3 className={styles.sectionTitle}>Committee & executive</h3>
            </div>
          </div>

          <div className={styles.recordList}>
            {snapshot.committeeRegistrations.length ? (
              snapshot.committeeRegistrations.map((registration) => (
                <form
                  key={registration.id}
                  action={(formData) => {
                    void handleUpdateRegistration(registration.id, formData, registration.title);
                  }}
                  className={styles.matchCard}
                >
                  <div className={styles.matchHeader}>
                    <div>
                      <p className={styles.matchTitle}>{registration.title}</p>
                      <p className={styles.listMeta}>{formatDateTime(registration.createdAt)}</p>
                    </div>
                    <span className={styles.matchStatus}>
                      {registration.category === "COMMITTEE" ? "Committee" : "Executive"}
                    </span>
                  </div>

                  <div className={styles.fieldGrid}>
                    <img alt={registration.headName} className={styles.thumb} src={registration.imageUrl} />
                    <img
                      alt={registration.coHeadName}
                      className={styles.thumb}
                      src={registration.coHeadImageUrl ?? registration.imageUrl}
                    />
                  </div>

                  <div className={styles.fieldGrid}>
                    <label className={styles.label}>
                      Type
                      <select
                        className={styles.select}
                        defaultValue={registration.category}
                        name="category"
                      >
                        <option value="COMMITTEE">Committee</option>
                        <option value="EXECUTIVE">Executive</option>
                      </select>
                    </label>
                    <label className={styles.label}>
                      Committee / Executive Name
                      <input
                        className={styles.input}
                        defaultValue={registration.title}
                        name="title"
                        required
                      />
                    </label>
                  </div>

                  <div className={styles.fieldGrid}>
                    <label className={styles.label}>
                      Head Name
                      <input
                        className={styles.input}
                        defaultValue={registration.headName}
                        name="headName"
                        required
                      />
                    </label>
                    <label className={styles.label}>
                      Co-head Name
                      <input
                        className={styles.input}
                        defaultValue={registration.coHeadName}
                        name="coHeadName"
                        required
                      />
                    </label>
                  </div>

                  <div className={styles.fieldGrid}>
                    <label className={styles.label}>
                      Head Email
                      <input
                        className={styles.input}
                        defaultValue={registration.headEmail ?? ""}
                        name="headEmail"
                        type="email"
                      />
                    </label>
                    <label className={styles.label}>
                      Head LinkedIn
                      <input
                        className={styles.input}
                        defaultValue={registration.headLinkedin ?? ""}
                        name="headLinkedin"
                        type="url"
                      />
                    </label>
                  </div>

                  <div className={styles.fieldGrid}>
                    <label className={styles.label}>
                      Co-head Email
                      <input
                        className={styles.input}
                        defaultValue={registration.coHeadEmail ?? ""}
                        name="coHeadEmail"
                        type="email"
                      />
                    </label>
                    <label className={styles.label}>
                      Co-head LinkedIn
                      <input
                        className={styles.input}
                        defaultValue={registration.coHeadLinkedin ?? ""}
                        name="coHeadLinkedin"
                        type="url"
                      />
                    </label>
                  </div>

                  <label className={styles.label}>
                    Replace Head Image
                    <input
                      accept={galleryFileInputAccept}
                      className={styles.input}
                      name="headImage"
                      type="file"
                    />
                  </label>

                  <label className={styles.label}>
                    Replace Co-head Image
                    <input
                      accept={galleryFileInputAccept}
                      className={styles.input}
                      name="coHeadImage"
                      type="file"
                    />
                  </label>

                  <div className={styles.buttonRow}>
                    <button
                      className={styles.secondaryButton}
                      disabled={busyAction !== null}
                      type="submit"
                    >
                      {busyAction === `registration-${registration.id}` ? "Saving..." : "Save registration"}
                    </button>
                  </div>
                </form>
              ))
            ) : (
              <p className={styles.emptyState}>
                Committee and executive registrations will appear here after submission.
              </p>
            )}
          </div>
        </section>
        ) : null}
      </div>
    </div>
  );
}






