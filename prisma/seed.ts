import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { runSeed } from "./seed.engine";

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: databaseUrl,
  }),
});

async function main() {
  console.log("🧹 Limpiando base de datos...");
  await prisma.userPermission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.menuNode.deleteMany();

  console.log("🌱 Sembrando estructura 2026...");
  await runSeed();

  console.log("✅ Seed 2026 ejecutado correctamente.");
}

main()
  .catch((error) => {
    console.error("❌ Error ejecutando seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
