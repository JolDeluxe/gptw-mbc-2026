import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import * as bcrypt from "bcryptjs";
import { ESTRUCTURA_2026, USUARIOS, NodeDefinition } from "./seed.data";

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: databaseUrl }),
});

export async function runSeed() {
  const nodeMapByName = new Map<string, number>();

  async function insertarNodo(nodo: NodeDefinition, parentId: number | null = null) {
    const created = await prisma.menuNode.create({
      data: {
        nombre: nodo.nombre,
        orden: nodo.orden,
        imageName: nodo.image || null,
        tipoEspecial: nodo.tipoEspecial || null,
        parentId: parentId,
      },
    });

    nodeMapByName.set(nodo.nombre, created.id);

    if (nodo.children && nodo.children.length > 0) {
      for (const child of nodo.children) {
        await insertarNodo(child, created.id);
      }
    }
  }

  // 1. Insertar árbol
  for (const rootNode of ESTRUCTURA_2026) {
    await insertarNodo(rootNode, null);
  }

  // 2. Insertar usuarios con bcrypt
  for (const user of USUARIOS) {
    const hash = await bcrypt.hash(user.password, 10);

    const permisosData = user.permisos
      .map((nombreNodo) => {
        const nodeId = nodeMapByName.get(nombreNodo);
        return nodeId ? { menuNodeId: nodeId } : null;
      })
      .filter((p): p is { menuNodeId: number } => p !== null);

    await prisma.user.create({
      data: {
        username: user.username,
        password: hash,
        nombre: user.nombre,
        role: user.role,
        permisos: {
          create: permisosData,
        },
      },
    });
  }
}
