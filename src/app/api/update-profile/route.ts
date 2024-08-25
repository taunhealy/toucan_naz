import { getServerSession } from "next-auth";
import { db } from "~/server/db";
import { authOptions } from "~/server/auth";
import { NextResponse } from "next/server";

interface UpdateProfileBody {
  linkedInUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: UpdateProfileBody = await req.json();
    console.log("Request body:", body);
    console.log("Session:", session);

    const { linkedInUrl, facebookUrl, instagramUrl } = body;
    const updateData = {
      linkedInUrl: linkedInUrl ?? undefined,
      facebookUrl: facebookUrl ?? undefined,
      instagramUrl: instagramUrl ?? undefined,
    };

    const updatedUser = await db.user.update({
      where: { email: session.user.email },
      data: updateData,
      select: {
        id: true,
        name: true,
        linkedInUrl: true,
        facebookUrl: true,
        instagramUrl: true,
      },
    });

    return NextResponse.json(
      { message: "Profile updated", user: updatedUser },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Error updating profile" },
      { status: 500 },
    );
  }
}
