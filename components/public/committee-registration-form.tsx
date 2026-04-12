"use client";

import type { FormEvent } from "react";
import { useRef, useState } from "react";

import { galleryFileInputAccept, galleryImageFormatLabel } from "@/lib/gallery-upload";
import type { RegistrationCategory } from "@/lib/types";

import styles from "@/components/public/committee-registration-form.module.css";

interface CommitteeRegistrationFormProps {
  maxUploadSizeMb: number;
}

const categoryLabels: Record<RegistrationCategory, string> = {
  COMMITTEE: "Committee",
  EXECUTIVE: "Executive",
};

export function CommitteeRegistrationForm({
  maxUploadSizeMb,
}: CommitteeRegistrationFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(
    null,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/register/committee", {
      method: "POST",
      body: formData,
    });
    const payload = (await response.json().catch(() => null)) as
      | { error?: string; registration?: { category: RegistrationCategory; title: string } }
      | null;

    setBusy(false);

    if (!response.ok) {
      setMessage({
        tone: "error",
        text: payload?.error ?? "Could not submit the registration right now.",
      });
      return;
    }

    setMessage({
      tone: "success",
      text: `${categoryLabels[payload?.registration?.category ?? "COMMITTEE"]} registration for ${
        payload?.registration?.title ?? "your team"
      } has been submitted.`,
    });
  }

  return (
    <div className={styles.shell}>
      <section className={styles.panel}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Team Registration</p>
          <h1 className={styles.title}>Committee / Executive</h1>
          <p className={styles.text}>
            Separate from member registrations.
          </p>
        </div>

        <form
          ref={formRef}
          className={styles.form}
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
        >
          <div className={styles.gridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Registration Type</span>
              <select className={styles.select} defaultValue="COMMITTEE" name="category" required>
                <option value="COMMITTEE">Committee</option>
                <option value="EXECUTIVE">Executive</option>
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Committee / Executive Name</span>
              <input
                className={styles.input}
                name="title"
                placeholder="Cultural Committee"
                required
              />
            </label>
          </div>

          <div className={styles.gridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Head Name</span>
              <input className={styles.input} name="headName" placeholder="Head name" required />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Co-head Name</span>
              <input
                className={styles.input}
                name="coHeadName"
                placeholder="Co-head name"
                required
              />
            </label>
          </div>

          <div className={styles.gridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Head Email</span>
              <input
                className={styles.input}
                name="headEmail"
                placeholder="head@udgam.com"
                type="email"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Head LinkedIn</span>
              <input
                className={styles.input}
                name="headLinkedin"
                placeholder="https://linkedin.com/in/head-name"
                type="url"
              />
            </label>
          </div>

          <div className={styles.gridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Co-head Email</span>
              <input
                className={styles.input}
                name="coHeadEmail"
                placeholder="cohead@udgam.com"
                type="email"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Co-head LinkedIn</span>
              <input
                className={styles.input}
                name="coHeadLinkedin"
                placeholder="https://linkedin.com/in/cohead-name"
                type="url"
              />
            </label>
          </div>

          <div className={styles.gridTwo}>
            <label className={styles.field}>
              <span className={styles.label}>Head Image</span>
              <input
                accept={galleryFileInputAccept}
                className={styles.input}
                name="headImage"
                required
                type="file"
              />
              <p className={styles.support}>
                Upload {galleryImageFormatLabel} up to {maxUploadSizeMb} MB.
              </p>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Co-head Image</span>
              <input
                accept={galleryFileInputAccept}
                className={styles.input}
                name="coHeadImage"
                required
                type="file"
              />
              <p className={styles.support}>
                Upload {galleryImageFormatLabel} up to {maxUploadSizeMb} MB.
              </p>
            </label>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.button}
              disabled={busy}
              type="submit"
            >
              {busy ? "Submitting..." : "Submit Registration"}
            </button>
            <p className={styles.meta}>Visible in the admin panel for review and edits.</p>
          </div>
        </form>

        {message ? (
          <p
            className={`${styles.message} ${
              message.tone === "success" ? styles.messageSuccess : styles.messageError
            }`}
          >
            {message.text}
          </p>
        ) : null}
      </section>
    </div>
  );
}
