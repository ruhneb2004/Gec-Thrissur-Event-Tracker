import { allowedEmails } from "@/lib/allowedEmailsAndColors";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !allowedEmails.includes(session.user?.email || "")) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  const { markerId, certificateLink } = body;

  if (!markerId) {
    return NextResponse.json(
      { message: "Marker ID is required" },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.event.findUnique({
      where: { id: markerId },
    });

    if (!existing) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    if (
      !session.user ||
      !session.user.email ||
      existing.creator !== session.user.email
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const updateMarker = await prisma.event.update({
      where: {
        id: markerId,
      },
      data: {
        certificateLink: certificateLink,
      },
    });

    return NextResponse.json(
      { message: "Successfully added certificate link!", data: updateMarker },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Some error occurred", data: error },
      {
        status: 500,
      }
    );
  }
}
