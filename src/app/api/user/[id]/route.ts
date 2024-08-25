import { db } from "~/server/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const user = await db.user.findUnique({
    where: { id: String(id) },
    select: {
      id: true,
      name: true,
      linkedInUrl: true,
      facebookUrl: true,
      instagramUrl: true,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
