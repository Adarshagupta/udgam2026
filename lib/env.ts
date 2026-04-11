import { defaultGalleryUploadLimitMb } from "@/lib/gallery-upload";

const r2Keys = [
  "R2_ACCOUNT_ID",
  "R2_BUCKET",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
] as const;

function parsePositiveNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const hasAllR2Keys = r2Keys.every((key) => Boolean(process.env[key]?.trim()));
const maxUploadSizeMb = parsePositiveNumber(
  process.env.R2_MAX_UPLOAD_SIZE_MB,
  defaultGalleryUploadLimitMb,
);

export const env = {
  baseUrl: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  nextAuthSecret: process.env.NEXTAUTH_SECRET ?? "dev-secret-change-me",
  hasDatabase: Boolean(process.env.DATABASE_URL),
  demoMode: process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL,
  admin: {
    email: process.env.ADMIN_EMAIL ?? "admin@udgam.local",
    password: process.env.ADMIN_PASSWORD ?? "UdgamAdmin@2026!",
    name: process.env.ADMIN_NAME ?? "UDGAM Admin",
  },
  r2: {
    configured: hasAllR2Keys,
    accountId: process.env.R2_ACCOUNT_ID ?? "",
    bucket: process.env.R2_BUCKET ?? "",
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
    publicUrl: (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, ""),
    maxUploadSizeMb,
    maxUploadBytes: maxUploadSizeMb * 1024 * 1024,
  },
} as const;
