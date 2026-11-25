"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDashboard } from "./DashboardContext";

export default function DashboardClient() {
  const searchParams = useSearchParams();
  const { setShowBackground } = useDashboard();

  const file = searchParams.get("view");
  const [resolvedFile, setResolvedFile] = useState(null);

  useEffect(() => {
    if (!file) {
      setResolvedFile(null);
      setShowBackground(true);
      return;
    }

    const isMobile = window.innerWidth < 1024;
    setResolvedFile(isMobile ? `M_${file}` : file);
    setShowBackground(false);
  }, [file, setShowBackground]);

  if (!resolvedFile) {
    return <div className="w-full h-full" />;
  }

  // Detectar si estamos viendo el esquema general para darle zoom out y centrado
  const isEsquema =
    resolvedFile.toLowerCase().includes("esquema") ||
    resolvedFile === "esquema.jpg";

  return (
    <div
      className={`w-full flex justify-center py-4 transition-all ${
        isEsquema ? "items-center" : "lg:justify-start"
      }`}
    >
      <img
        src={`/api/images?file=${resolvedFile}`}
        alt="Reporte"
        className={`transition-all rounded-lg ${
          isEsquema
            ? "max-h-[82vh] w-auto max-w-full object-contain shadow-md"
            : "w-full lg:w-[1500px] scale-105 lg:scale-100"
        }`}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/img/no-image.avif";
        }}
      />
    </div>
  );
}
