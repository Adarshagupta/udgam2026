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
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fileToDataUrl(upload: PreparedGalleryImageUpload) {
  return `data:${upload.contentType};base64,${upload.buffer.toString("base64")}`;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image");
  const parsed = createCommitteeRegistrationSchema.safeParse({
    category: String(formData.get("category") ?? ""),
    title: String(formData.get("title") ?? ""),
    headName: String(formData.get("headName") ?? ""),
    coHeadName: String(formData.get("coHeadName") ?? ""),
  });

  if (!parsed.success || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Image, committee or executive name, head name, and co-head name are required." },
      { status: 400 },
    );
  }

  try {
    const upload = await prepareGalleryImageUpload(file);
    let uploadResult: { key?: string; url: string };

    if (env.r2.configured) {
      uploadResult = await uploadImageToR2(upload, {
        directory: "registrations/committee",
      });
    } else if (env.demoMode) {
      uploadResult = {
        url: fileToDataUrl(upload),
      };
    } else {
      return NextResponse.json(
        { error: "Cloudflare R2 is not configured for registration uploads." },
        { status: 503 },
      );
    }

    const registration = await createCommitteeRegistration({
      ...parsed.data,
      imageUrl: uploadResult.url,
      imageR2Key: uploadResult.key,
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
