import { NextResponse } from "next/server";

import { getAuthSession } from "@/lib/auth";
import { createGalleryImage, getGalleryImages } from "@/lib/data";
import { env } from "@/lib/env";
import {
  prepareGalleryImageUpload,
  uploadImageToR2,
  type PreparedGalleryImageUpload,
} from "@/lib/r2";
import { emitGalleryUpdate } from "@/lib/socket-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fileToDataUrl(upload: PreparedGalleryImageUpload) {
  return `data:${upload.contentType};base64,${upload.buffer.toString("base64")}`;
}

export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const title = String(formData.get("title") ?? "");
  const caption = String(formData.get("caption") ?? "");
  const featured = formData.get("featured") === "on";
  const file = formData.get("file");
  const cleanTitle = title.trim();
  const cleanCaption = caption.trim();

  if (!(file instanceof File) || !cleanTitle) {
    return NextResponse.json({ error: "Image title and file are required." }, { status: 400 });
  }

  try {
    const upload = await prepareGalleryImageUpload(file);
    let uploadResult: { key?: string; url: string };

    if (env.r2.configured) {
      uploadResult = await uploadImageToR2(upload);
    } else if (env.demoMode) {
      uploadResult = {
        url: fileToDataUrl(upload),
      };
    } else {
      return NextResponse.json(
        { error: "Cloudflare R2 is not configured for production uploads." },
        { status: 503 },
      );
    }

    const image = await createGalleryImage({
      title: cleanTitle,
      caption: cleanCaption || undefined,
      featured,
      url: uploadResult.url,
      uploadedById: session.user.id,
      r2Key: uploadResult.key,
    });

    emitGalleryUpdate(await getGalleryImages());

    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed.",
      },
      { status: 400 },
    );
  }
}