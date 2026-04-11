import { NextResponse } from "next/server";

import { getObjectFromR2 } from "@/lib/r2";

export const runtime = "nodejs";

interface MediaRouteProps {
  params: Promise<{
    key: string[];
  }>;
}

export async function GET(_request: Request, { params }: MediaRouteProps) {
  const { key } = await params;
  const objectKey = key.join("/");

  if (!objectKey) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  try {
    const object = await getObjectFromR2(objectKey);

    if (!object.Body) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const headers = new Headers({
      "Cache-Control": object.CacheControl ?? "public, max-age=31536000, immutable",
      "Content-Type": object.ContentType ?? "application/octet-stream",
    });

    if (typeof object.ContentLength === "number") {
      headers.set("Content-Length", object.ContentLength.toString());
    }

    return new Response(object.Body.transformToWebStream(), {
      headers,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      ("name" in error || "Code" in error) &&
      (error.name === "NoSuchKey" || (error as { Code?: string }).Code === "NoSuchKey")
    ) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return NextResponse.json({ error: "Could not load media." }, { status: 500 });
  }
}
