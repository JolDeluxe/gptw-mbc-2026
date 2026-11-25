import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Calculamos una huella digital basada en:
    // 1. Cantidad de nodos en el menú
    // 2. Suma de IDs o nombres
    // 3. Cantidad de usuarios
    const [nodeCount, userCount, latestNode] = await Promise.all([
      prisma.menuNode.count(),
      prisma.user.count(),
      prisma.menuNode.findFirst({
        orderBy: { id: "desc" },
        select: { id: true, nombre: true },
      }),
    ]);

    const versionHash = `${nodeCount}-${userCount}-${latestNode?.id || 0}`;

    return NextResponse.json({
      version: versionHash,
      timestamp: Date.now(),
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
      },
    });
  } catch (error) {
    return NextResponse.json({ version: "1" });
  }
}
