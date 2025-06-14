import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { searchQuery } = body;
  try {
    const getAllMarkers = await prisma.event.findMany({
      where: {
        deleted: false,
        title: {
          contains: searchQuery || "",
          mode: "insensitive",
        },
      },
      include: {
        Attending: true,
      },
      orderBy: {
        time: "desc",
      },
    });
    if (getAllMarkers.length === 0) {
      return NextResponse.json(
        { message: "No markers found", data: [] },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "Markers found", data: getAllMarkers },
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
