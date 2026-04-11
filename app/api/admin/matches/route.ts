import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { createMatch, getMatches } from "@/lib/data";
import { emitScoreUpdate } from "@/lib/socket-server";

const createMatchSchema = z.object({
  sportId: z.string().min(1).optional(),
  sport: z.string().min(2).optional(),
  eventTitle: z.string().min(2),
  homeTeamId: z.string().min(1).optional(),
  awayTeamId: z.string().min(1).optional(),
  homeTeam: z.string().min(2).optional(),
  awayTeam: z.string().min(2).optional(),
  venue: z.string().min(2),
  startsAt: z.string().datetime(),
  status: z.enum(["SCHEDULED", "LIVE", "PAUSED", "HALFTIME", "FINAL"]),
  featured: z.boolean().optional(),
}).superRefine((value, context) => {
  if (!value.sportId && !value.sport) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["sport"],
      message: "Select a sport or provide one by name.",
    });
  }

  if (!value.homeTeamId && !value.homeTeam) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["homeTeam"],
      message: "Select a home team or provide one by name.",
    });
  }

  if (!value.awayTeamId && !value.awayTeam) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["awayTeam"],
      message: "Select an away team or provide one by name.",
    });
  }
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createMatchSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid match payload." }, { status: 400 });
  }

  try {
    const match = await createMatch(parsed.data);
    emitScoreUpdate(await getMatches());

    return NextResponse.json({ match }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not create the match.",
      },
      { status: 400 },
    );
  }
}

