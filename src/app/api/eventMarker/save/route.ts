import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { allowedEmails } from "@/lib/allowedEmailsAndColors";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  console.log("Session:", session);
  console.log(allowedEmails);
  if (!session || !allowedEmails.includes(session.user?.email || "")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const markerData = {
    title: body.title,
    description: body.description,
    time: new Date(body.time),
    markerDisapperingTime: new Date(body.markerDisapperingTime),
    eventLink: body.eventLink,
    lat: body.lat,
    lng: body.lng,
    color: body.color,
    creator: session.user?.email || "",
    deleted: false,
  };

  console.log("Request body:", body);

  try {
    const markerExists = await prisma.event.findUnique({
      where: { id: body.id },
    });
    if (markerExists) {
      const updateMarker = await prisma.event.update({
        where: {
          id: body.id,
        },
        data: markerData,
      });
      console.log("marker updated ", updateMarker);
      return NextResponse.json(
        { message: "Successfully updated a event", data: updateMarker },
        {
          status: 200,
        }
      );
    }
    const createMarker = await prisma.event.create({
      data: markerData,
    });
    console.log("createMarker ", createMarker);
    return NextResponse.json(
      { message: "Successfully created a new event", data: createMarker },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Some error occured", data: error },
      {
        status: 500,
      }
    );
  }
}
