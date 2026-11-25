import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BASE_PATH =
  process.env.IMAGES_BASE_PATH ||
  String.raw`H:\AUDITOR INTERNO\PRIVADO\5 Isaac\gptw-2026`;

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get("file");

  if (!fileName) {
    return new NextResponse("Archivo requerido", { status: 400 });
  }

  const safeFileName = path.basename(fileName);

  // 1. Resolver archivo físico solicitado
  let finalPath = path.join(BASE_PATH, safeFileName);

  // Fallback versión móvil si no existe
  if (!fs.existsSync(finalPath) && safeFileName.startsWith("M_")) {
    const fallbackFile = safeFileName.replace("M_", "");
    const fallbackPath = path.join(BASE_PATH, fallbackFile);
    if (fs.existsSync(fallbackPath)) {
      finalPath = fallbackPath;
    }
  }

  // 2. Si no existe, usar fallback automático de prueba (100.png, 101.png o cualquier imagen existente)
  if (!fs.existsSync(finalPath)) {
    const testFallback = path.join(BASE_PATH, "100.png");
    if (fs.existsSync(testFallback)) {
      finalPath = testFallback;
    } else {
      // Fallback a imagen estática del proyecto
      const publicFallback = path.join(process.cwd(), "public", "img", "01_Cuadra.webp");
      if (fs.existsSync(publicFallback)) {
        finalPath = publicFallback;
      } else {
        return new NextResponse("No encontrada", { status: 404 });
      }
    }
  }

  // 3. Transmisión con Stream
  const ext = path.extname(finalPath).toLowerCase();
  let contentType = "image/png";
  if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
  else if (ext === ".webp") contentType = "image/webp";
  else if (ext === ".avif") contentType = "image/avif";

  const fileStream = fs.createReadStream(finalPath);

  const webStream = new ReadableStream({
    start(controller) {
      fileStream.on("data", (chunk) => controller.enqueue(chunk));
      fileStream.on("end", () => controller.close());
      fileStream.on("error", (err) => controller.error(err));
    },
  });

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
