import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { getMatches, updateMatch } from "@/lib/data";
import { emitScoreUpdate } from "@/lib/socket-server";

const updateMatchSchema = z.object({
  homeScore: z.number().int().min(0),
  awayScore: z.number().int().min(0),
  status: z.enum(["SCHEDULED", "LIVE", "PAUSED", "HALFTIME", "FINAL"]),
  featured: z.boolean(),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    matchId: string;
  }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = updateMatchSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid score update." }, { status: 400 });
  }

  try {
    const { matchId } = await context.params;
    const match = await updateMatch(matchId, parsed.data);
    emitScoreUpdate(await getMatches());

    return NextResponse.json({ match });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not update the match.",
      },
      { status: 400 },
    );
  }
}

