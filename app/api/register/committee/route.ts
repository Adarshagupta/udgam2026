import { NextResponse } from "next/server";
import { z } from "zod";

import { createCommitteeRegistration } from "@/lib/data";
import { env } from "@/lib/env";
import {
  prepareGalleryImageUpload,
  uploadImageToR2,
  type PreparedGalleryImageUpload,
} from "@/lib/r2";

const createCommitteeRegistrationSchema = z.object({
  category: z.enum(["COMMITTEE", "EXECUTIVE"]),
  title: z.string().trim().min(2).max(80),
  headName: z.string().trim().min(2).max(80),
  coHeadName: z.string().trim().min(2).max(80),
  headEmail: z.union([z.string().trim().email().max(120), z.literal("")]),
  headLinkedin: z.union([z.string().trim().url().max(240), z.literal("")]),
  coHeadEmail: z.union([z.string().trim().email().max(120), z.literal("")]),
  coHeadLinkedin: z.union([z.string().trim().url().max(240), z.literal("")]),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fileToDataUrl(upload: PreparedGalleryImageUpload) {
  return `data:${upload.contentType};base64,${upload.buffer.toString("base64")}`;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const headImage = formData.get("headImage");
  const coHeadImage = formData.get("coHeadImage");
  const parsed = createCommitteeRegistrationSchema.safeParse({
    category: String(formData.get("category") ?? ""),
    title: String(formData.get("title") ?? ""),
    headName: String(formData.get("headName") ?? ""),
    coHeadName: String(formData.get("coHeadName") ?? ""),
    headEmail: String(formData.get("headEmail") ?? ""),
    headLinkedin: String(formData.get("headLinkedin") ?? ""),
    coHeadEmail: String(formData.get("coHeadEmail") ?? ""),
    coHeadLinkedin: String(formData.get("coHeadLinkedin") ?? ""),
  });

  if (!parsed.success || !(headImage instanceof File) || !(coHeadImage instanceof File)) {
    return NextResponse.json(
      {
        error:
          "Head image, co-head image, committee or executive name, head name, and co-head name are required.",
      },
      { status: 400 },
    );
  }

  try {
    const headUpload = await prepareGalleryImageUpload(headImage);
    const coHeadUpload = await prepareGalleryImageUpload(coHeadImage);
    let headUploadResult: { key?: string; url: string };
    let coHeadUploadResult: { key?: string; url: string };

    if (env.r2.configured) {
      headUploadResult = await uploadImageToR2(headUpload, {
        directory: "registrations/committee",
      });
      coHeadUploadResult = await uploadImageToR2(coHeadUpload, {
        directory: "registrations/committee",
      });
    } else if (env.demoMode) {
      headUploadResult = {
        url: fileToDataUrl(headUpload),
      };
      coHeadUploadResult = {
        url: fileToDataUrl(coHeadUpload),
      };
    } else {
      return NextResponse.json(
        { error: "Cloudflare R2 is not configured for registration uploads." },
        { status: 503 },
      );
    }

    const registration = await createCommitteeRegistration({
      ...parsed.data,
      imageUrl: headUploadResult.url,
      imageR2Key: headUploadResult.key,
      coHeadImageUrl: coHeadUploadResult.url,
      coHeadImageR2Key: coHeadUploadResult.key,
    });

    return NextResponse.json({ registration }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not submit the registration.",
      },
      { status: 400 },
    );
  }
}
