import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { createContentPost } from "@/lib/data";

const createPostSchema = z.object({
  type: z.enum(["BLOG", "NEWS"]),
  title: z.string().trim().min(4),
  summary: z.string().trim().min(12),
  body: z.string().trim().min(24),
  sportId: z.string().trim().optional(),
  published: z.boolean().optional(),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createPostSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid post payload." }, { status: 400 });
  }

  try {
    const post = await createContentPost({
      ...parsed.data,
      authorId: session.user.id,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not publish the post.",
      },
      { status: 400 },
    );
  }
}
