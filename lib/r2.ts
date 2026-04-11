import { randomUUID } from "node:crypto";
import { Buffer } from "node:buffer";

import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { env } from "@/lib/env";
import { galleryImageFormatLabel } from "@/lib/gallery-upload";
import { slugify } from "@/lib/utils";

let client: S3Client | null = null;

const extensionToMimeType = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
} as const;

type AllowedImageMimeType =
  (typeof extensionToMimeType)[keyof typeof extensionToMimeType];

const mimeTypeToExtension: Record<AllowedImageMimeType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export interface PreparedGalleryImageUpload {
  buffer: Buffer;
  contentType: AllowedImageMimeType;
  extension: string;
  fileNameStem: string;
}

interface UploadImageToR2Options {
  directory?: string;
}

function getR2Client() {
  if (!env.r2.configured) {
    throw new Error("Cloudflare R2 is not configured.");
  }

  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${env.r2.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.r2.accessKeyId,
        secretAccessKey: env.r2.secretAccessKey,
      },
    });
  }

  return client;
}

export function getR2ObjectUrl(key: string) {
  if (env.r2.publicUrl) {
    return `${env.r2.publicUrl}/${key}`;
  }

  return `/api/media/${key}`;
}

function resolveContentType(file: File): AllowedImageMimeType | null {
  const normalizedType = file.type.toLowerCase();

  if (normalizedType in mimeTypeToExtension) {
    return normalizedType as AllowedImageMimeType;
  }

  const extension = file.name.includes(".")
    ? file.name.split(".").pop()?.toLowerCase() ?? ""
    : "";

  if (extension in extensionToMimeType) {
    return extensionToMimeType[extension as keyof typeof extensionToMimeType];
  }

  return null;
}

function buildFileNameStem(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  return slugify(baseName).slice(0, 48) || "gallery-frame";
}

export async function prepareGalleryImageUpload(file: File): Promise<PreparedGalleryImageUpload> {
  if (file.size <= 0) {
    throw new Error("Choose an image file to upload.");
  }

  const contentType = resolveContentType(file);

  if (!contentType) {
    throw new Error(`Unsupported image format. Use ${galleryImageFormatLabel}.`);
  }

  if (file.size > env.r2.maxUploadBytes) {
    throw new Error(`Image must be ${env.r2.maxUploadSizeMb} MB or smaller.`);
  }

  return {
    buffer: Buffer.from(await file.arrayBuffer()),
    contentType,
    extension: mimeTypeToExtension[contentType],
    fileNameStem: buildFileNameStem(file.name),
  };
}

export async function uploadImageToR2(
  upload: PreparedGalleryImageUpload,
  options?: UploadImageToR2Options,
) {
  const now = new Date();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const directory = options?.directory?.trim().replace(/^\/+|\/+$/g, "") || "gallery";
  const key = `${directory}/${now.getUTCFullYear()}/${month}/${randomUUID()}-${upload.fileNameStem}.${upload.extension}`;

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: env.r2.bucket,
      Key: key,
      Body: upload.buffer,
      CacheControl: "public, max-age=31536000, immutable",
      ContentLength: upload.buffer.byteLength,
      ContentType: upload.contentType,
    }),
  );

  return {
    key,
    url: getR2ObjectUrl(key),
  };
}

export async function getObjectFromR2(key: string) {
  return getR2Client().send(
    new GetObjectCommand({
      Bucket: env.r2.bucket,
      Key: key,
    }),
  );
}
