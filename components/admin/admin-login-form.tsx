"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import styles from "@/components/admin/admin.module.css";

interface AdminLoginFormProps {
  demoHint: {
    email: string;
    password: string;
  } | null;
}

export function AdminLoginForm({ demoHint }: AdminLoginFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setMessage("Login failed. Check the organizer credentials and try again.");
      return;
    }

    setMessage("Desk unlocked. Loading controls...");
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className={styles.authShell}>
      <section className={styles.authHero}>
        <p className={styles.sidebarEyebrow}>UDGAM ADMIN</p>
        <h1 className={styles.authTitle}>Admin Dashboard</h1>
        <p className={styles.authText}>Sports, scores, posts, media.</p>

        <div className={styles.authHighlights}>
          <article className={styles.authHighlight}>
            <span className={styles.authHighlightLabel}>Sports</span>
            <strong>Teams and fixtures</strong>
          </article>
          <article className={styles.authHighlight}>
            <span className={styles.authHighlightLabel}>Updates</span>
            <strong>News and blog</strong>
          </article>
          <article className={styles.authHighlight}>
            <span className={styles.authHighlightLabel}>Live</span>
            <strong>Scores and gallery</strong>
          </article>
        </div>
      </section>

      <section className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <p className={styles.sectionEyebrow}>Organizer access</p>
          <h2 className={styles.loginTitle}>Sign in</h2>
          <p className={styles.sectionText}>Use organizer access.</p>
        </div>

        {demoHint ? (
          <div className={styles.credentialCard}>
            <span className={styles.authHighlightLabel}>Demo login</span>
            <p className={styles.credentialValue}>{demoHint.email}</p>
            <p className={styles.credentialValue}>{demoHint.password}</p>
          </div>
        ) : null}

        <form
          action={(formData) => {
            void handleSubmit(formData);
          }}
          className={styles.form}
        >
          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              defaultValue={demoHint?.email}
              name="email"
              type="email"
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              defaultValue={demoHint?.password}
              name="password"
              type="password"
            />
          </label>
          <div className={styles.buttonRow}>
            <button className={styles.primaryButton} disabled={isPending} type="submit">
              {isPending ? "Signing in..." : "Enter dashboard"}
            </button>
          </div>
          {message ? <p className={styles.message}>{message}</p> : null}
        </form>
      </section>
    </div>
  );
}

