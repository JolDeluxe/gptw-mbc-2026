import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        nombre: true,
        role: true,
      },
      orderBy: {
        nombre: "asc",
      },
    });

    return NextResponse.json(usuarios, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}
