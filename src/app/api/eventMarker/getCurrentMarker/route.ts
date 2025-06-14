import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const getValidMarkers = await prisma.event.findMany({
      where: {
        markerDisapperingTime: {
          gte: new Date(),
        },
        deleted: false,
      },
      include: {
        Attending: true,
      },
    });
    if (getValidMarkers.length === 0) {
      return NextResponse.json(
        { message: "No active markers found", data: [] },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "Marker found", data: getValidMarkers },
      {
        status: 200,
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
