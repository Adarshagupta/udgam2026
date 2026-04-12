import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { updateCommitteeRegistration } from "@/lib/data";
import { env } from "@/lib/env";
import {
  prepareGalleryImageUpload,
  uploadImageToR2,
  type PreparedGalleryImageUpload,
} from "@/lib/r2";

const updateCommitteeRegistrationSchema = z.object({
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

interface RouteProps {
  params: Promise<{
    registrationId: string;
  }>;
}

function fileToDataUrl(upload: PreparedGalleryImageUpload) {
  return `data:${upload.contentType};base64,${upload.buffer.toString("base64")}`;
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { registrationId } = await params;
  const formData = await request.formData();
  const parsed = updateCommitteeRegistrationSchema.safeParse({
    category: String(formData.get("category") ?? ""),
    title: String(formData.get("title") ?? ""),
    headName: String(formData.get("headName") ?? ""),
    coHeadName: String(formData.get("coHeadName") ?? ""),
    headEmail: String(formData.get("headEmail") ?? ""),
    headLinkedin: String(formData.get("headLinkedin") ?? ""),
    coHeadEmail: String(formData.get("coHeadEmail") ?? ""),
    coHeadLinkedin: String(formData.get("coHeadLinkedin") ?? ""),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid registration payload." }, { status: 400 });
  }

  const headImage = formData.get("headImage");
  const coHeadImage = formData.get("coHeadImage");

  try {
    let imageUpdate: {
      imageUrl?: string;
      imageR2Key?: string;
      coHeadImageUrl?: string;
      coHeadImageR2Key?: string;
    } = {};

    if (headImage instanceof File && headImage.size > 0) {
      const upload = await prepareGalleryImageUpload(headImage);

      if (env.r2.configured) {
        const uploadResult = await uploadImageToR2(upload, {
          directory: "registrations/committee",
        });

        imageUpdate = {
          imageUrl: uploadResult.url,
          imageR2Key: uploadResult.key,
        };
      } else if (env.demoMode) {
        imageUpdate = {
          imageUrl: fileToDataUrl(upload),
        };
      } else {
        return NextResponse.json(
          { error: "Cloudflare R2 is not configured for registration uploads." },
          { status: 503 },
        );
      }
    }

    if (coHeadImage instanceof File && coHeadImage.size > 0) {
      const upload = await prepareGalleryImageUpload(coHeadImage);

      if (env.r2.configured) {
        const uploadResult = await uploadImageToR2(upload, {
          directory: "registrations/committee",
        });

        imageUpdate = {
          ...imageUpdate,
          coHeadImageUrl: uploadResult.url,
          coHeadImageR2Key: uploadResult.key,
        };
      } else if (env.demoMode) {
        imageUpdate = {
          ...imageUpdate,
          coHeadImageUrl: fileToDataUrl(upload),
        };
      } else {
        return NextResponse.json(
          { error: "Cloudflare R2 is not configured for registration uploads." },
          { status: 503 },
        );
      }
    }

    const registration = await updateCommitteeRegistration(registrationId, {
      ...parsed.data,
      ...imageUpdate,
    });

    return NextResponse.json({ registration }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not update the registration.",
      },
      { status: 400 },
    );
  }
}
