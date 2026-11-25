"use client";
import { createContext, useContext, useState, useEffect } from "react";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [showBackground, setShowBackground] = useState(true);
  const [systemVersion, setSystemVersion] = useState(null);

  // Sincronización en tiempo real sin recargar página:
  // Consulta periódicamente en segundo plano si cambió la base de datos o backend
  useEffect(() => {
    let intervalId;

    const checkSystemUpdate = async () => {
      try {
        const res = await fetch("/api/system/version", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (systemVersion && data.version !== systemVersion) {
            // Se detectó cambio en backend o BD: disparar evento global para actualizar menú e interfaz
            setSystemVersion(data.version);
            window.dispatchEvent(new CustomEvent("mbc_system_updated"));
          } else if (!systemVersion) {
            setSystemVersion(data.version);
          }
        }
      } catch (e) {
        // Silencioso en caso de pérdida momentánea de red
      }
    };

    checkSystemUpdate();
    // Consulta cada 15 segundos de forma ultra-ligera (menos de 100 bytes)
    intervalId = setInterval(checkSystemUpdate, 15000);

    return () => clearInterval(intervalId);
  }, [systemVersion]);

  return (
    <DashboardContext.Provider value={{ showBackground, setShowBackground }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used inside DashboardProvider");
  }
  return ctx;
}
