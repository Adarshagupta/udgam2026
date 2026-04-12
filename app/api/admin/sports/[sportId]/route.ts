import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { updateSport } from "@/lib/data";

const updateSportSchema = z.object({
  name: z.string().trim().min(2),
  accent: z.string().trim().optional().catch(""),
  imageUrl: z.string().trim().optional().catch(""),
  tagline: z.string().trim().optional().catch(""),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ sportId: string }> },
) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sportId } = await params;
  const parsed = updateSportSchema.safeParse(await request.json());

  if (!parsed.success) {
    console.error("Sport update payload validation failed", parsed.error.flatten());
    return NextResponse.json(
      { error: "Invalid sport payload.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const payload = parsed.data;

  try {
    const sport = await updateSport(sportId, payload);
    return NextResponse.json({ sport }, { status: 200 });
  } catch (error) {
    console.error("Sport update failed", {
      sportId,
      payload,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not update the sport.",
      },
      { status: 400 },
    );
  }
}
