import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { createTeam } from "@/lib/data";

const createTeamSchema = z.object({
  name: z.string().trim().min(2),
  shortName: z.string().trim().max(6).optional(),
  institution: z.string().trim().optional(),
  sportId: z.string().trim().optional(),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createTeamSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid team payload." }, { status: 400 });
  }

  try {
    const team = await createTeam(parsed.data);
    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not create the team.",
      },
      { status: 400 },
    );
  }
}
