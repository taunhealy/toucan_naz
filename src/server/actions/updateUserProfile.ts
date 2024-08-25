import { getServerSession } from "next-auth";
import { db } from "~/server/db";
import { authOptions } from "~/server/auth";
import type { NextApiRequest, NextApiResponse } from "next";

interface UpdateProfileBody {
  linkedInUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export const updateUserProfile = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { linkedInUrl, facebookUrl, instagramUrl } =
      req.body as UpdateProfileBody;
    const updateData = {
      linkedInUrl: linkedInUrl ?? undefined,
      facebookUrl: facebookUrl ?? undefined,
      instagramUrl: instagramUrl ?? undefined,
    };

    await db.user.update({
      where: { email: session.user.email },
      data: updateData,
    });

    return res.status(200).json({ message: "Profile updated" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating profile" });
  }
};
