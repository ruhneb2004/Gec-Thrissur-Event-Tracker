import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, eventId, status } = body;

  if (!userId || !eventId || typeof status !== "boolean") {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  try {
    const eventExists = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!eventExists) {
      return NextResponse.json(
        { message: "Event does not exist" },
        { status: 404 }
      );
    }

    const timePassed = new Date(eventExists.markerDisapperingTime) < new Date();
    if (timePassed) {
      return NextResponse.json(
        { message: "Event has already passed" },
        { status: 400 }
      );
    }

    const attending = status
      ? await prisma.attending.create({
          data: { userId, eventId },
        })
      : await prisma.attending.delete({
          where: {
            userId_eventId: {
              userId,
              eventId,
            },
          },
        });

    return NextResponse.json(
      {
        message: `Successfully ${
          status ? "added attendance" : "removed attendance"
        }`,
        data: attending,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: "Some error occurred",
        data: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
