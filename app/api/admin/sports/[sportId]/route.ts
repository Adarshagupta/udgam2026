import { NextResponse } from next/server;
import { z } from zod;

import { getAuthSession } from @/lib/auth;
import { updateSport } from @/lib/data;

const updateSportSchema = z.object({
  name: z.string().trim().min(2),
  accent: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
  tagline: z.string().trim().optional(),
});

export const runtime = nodejs;
export const dynamic = force-dynamic;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ sportId: string }> },
) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: Unauthorized }, { status: 401 });
  }

  const { sportId } = await params;
  const parsed = updateSportSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: Invalid sport payload. }, { status: 400 });
  }

  try {
    const sport = await updateSport(sportId, parsed.data);
    return NextResponse.json({ sport }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : Could not update the sport.,
      },
      { status: 400 },
    );
  }
}
