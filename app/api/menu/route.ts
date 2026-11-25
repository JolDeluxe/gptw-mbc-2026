import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getUserFromToken } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // 1. Obtener usuario de la query o de la cookie
    const { searchParams } = new URL(request.url);
    const usernameParam = searchParams.get("username");

    let user = null;

    if (usernameParam) {
      const foundUser = await prisma.user.findUnique({
        where: { username: usernameParam },
      });
      if (foundUser) {
        user = {
          id: foundUser.id,
          username: foundUser.username,
          nombre: foundUser.nombre,
          role: foundUser.role,
        };
      }
    }

    if (!user) {
      user = await getUserFromToken();
    }

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        permisos: {
          include: {
            menuNode: true,
          },
        },
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Usuario no existe" }, { status: 404 });
    }

    const allNodes = await prisma.menuNode.findMany({
      orderBy: { orden: "asc" },
    });

    function buildTree(parentId: number | null): any[] {
      return allNodes
        .filter((n) => n.parentId === parentId)
        .map((n) => {
          const children = buildTree(n.id);
          return {
            id: n.id,
            nombre: n.nombre,
            orden: n.orden,
            imageName: n.imageName,
            tipoEspecial: n.tipoEspecial,
            children: children.length > 0 ? children : undefined,
          };
        });
    }

    if (dbUser.role === "NIVEL 1") {
      const fullTree = buildTree(null);
      return NextResponse.json(fullTree);
    }

    const allowedNodeIds = new Set<number>();

    function addWithDescendants(nodeId: number) {
      allowedNodeIds.add(nodeId);
      allNodes
        .filter((n) => n.parentId === nodeId)
        .forEach((child) => addWithDescendants(child.id));
    }

    function addAncestors(nodeId: number) {
      const node = allNodes.find((n) => n.id === nodeId);
      if (node && node.parentId) {
        allowedNodeIds.add(node.parentId);
        addAncestors(node.parentId);
      }
    }

    for (const perm of dbUser.permisos) {
      addWithDescendants(perm.menuNodeId);
      addAncestors(perm.menuNodeId);
    }

    // Asegurar que ESQUEMA esté disponible si existe
    const esquemaNode = allNodes.find((n) => n.tipoEspecial === "esquema");
    if (esquemaNode) {
      allowedNodeIds.add(esquemaNode.id);
    }

    function filterTree(parentId: number | null): any[] {
      return allNodes
        .filter((n) => n.parentId === parentId && allowedNodeIds.has(n.id))
        .map((n) => {
          const children = filterTree(n.id);
          return {
            id: n.id,
            nombre: n.nombre,
            orden: n.orden,
            imageName: n.imageName,
            tipoEspecial: n.tipoEspecial,
            children: children.length > 0 ? children : undefined,
          };
        });
    }

    const userTree = filterTree(null);
    return NextResponse.json(userTree);
  } catch (error: any) {
    console.error("Error en GET /api/menu:", error);
    return NextResponse.json({ error: "Error interno del servidor", detalle: error?.message }, { status: 500 });
  }
}
