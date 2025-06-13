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
  const { markerId } = body;

  if (!markerId) {
    return NextResponse.json(
      { message: "Marker ID is required" },
      { status: 400 }
    );
  }
  try {
    const deleteMarker = await prisma.event.update({
      where: {
        id: markerId,
      },
      data: {
        deleted: true,
      },
    });

    return NextResponse.json(
      { message: "Successfully deleted the event", data: deleteMarker },
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
