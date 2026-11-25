"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function HeaderDesktop({ user }) {
  const router = useRouter();
  const [menu, setMenu] = useState([]);
  const [selectedChain, setSelectedChain] = useState([]);

  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const fetchMenu = useCallback(() => {
    if (!user?.username) return;

    fetch(`/api/menu?username=${encodeURIComponent(user.username)}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) return;
        setMenu(data);
      })
      .catch((err) => console.error("Error al cargar menú:", err));
  }, [user]);

  useEffect(() => {
    fetchMenu();

    const handleUpdate = () => {
      fetchMenu();
    };

    window.addEventListener("mbc_system_updated", handleUpdate);
    return () => window.removeEventListener("mbc_system_updated", handleUpdate);
  }, [fetchMenu]);

  useEffect(() => {
    // Si no hay nada seleccionado, seleccionar MBC por defecto si existe
    if (menu.length > 0 && selectedChain.length === 0) {
      handleSelect(menu[0], 0);
    }
  }, [menu]);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("usuario_mbc");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      router.replace("/login");
    }, 400);
  };

  const handleSelect = (node, levelIndex) => {
    const newChain = selectedChain.slice(0, levelIndex);
    newChain[levelIndex] = node;
    setSelectedChain(newChain);

    if (node.imageName) {
      router.push(`/dashboard?view=${node.imageName}`);
    }

    if (node.children && node.children.length === 1) {
      handleSelect(node.children[0], levelIndex + 1);
    }
  };

  const rows = [];
  if (menu.length > 0) {
    rows.push({
      level: 0,
      nodes: menu,
      activeNode: selectedChain[0],
    });
  }

  for (let i = 0; i < selectedChain.length; i++) {
    const parent = selectedChain[i];
    if (parent && parent.children && parent.children.length > 0) {
      rows.push({
        level: i + 1,
        nodes: parent.children,
        activeNode: selectedChain[i + 1],
      });
    }
  }

  // Estilo condicional para el nivel 0
  const getNodeColorClass = (node, isActive) => {
    if (node.tipoEspecial === "mbc") {
      // Color Café característico de Cuadra
      return isActive
        ? "text-[#78350f] border-[#78350f] font-black"
        : "text-[#92400e] border-transparent hover:text-[#78350f]";
    }
    if (node.tipoEspecial === "esquema") {
      // Color Negro sobrio
      return isActive
        ? "text-black border-black font-black"
        : "text-gray-500 border-transparent hover:text-black";
    }
    // Estilo estándar
    return isActive
      ? "text-amber-950 border-amber-900 font-black"
      : "text-gray-400 border-transparent hover:text-gray-800";
  };

  return (
    <div className="flex flex-col w-full bg-white shadow-sm z-50">
      {/* BARRA SUPERIOR: LOGOS Y PERFIL */}
      <div className="relative flex justify-center items-center py-3 border-b border-gray-100">
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => {
            if (menu.length > 0) handleSelect(menu[0], 0);
          }}
        >
          <img src="/img/GPTW.webp" alt="GPTW" className="h-10 w-auto opacity-90" />
          <img src="/img/01_Cuadra.webp" alt="Cuadra" className="h-7 w-auto" />
        </div>

        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-3">
          <span className="text-[10px] font-bold text-gray-500 uppercase hidden xl:block">
            {user?.nombre}
          </span>

          {!confirmLogout ? (
            <button
              onClick={() => setConfirmLogout(true)}
              className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded border border-red-600 text-red-600 hover:bg-red-50 transition cursor-pointer"
            >
              Salir
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfirmLogout(false)}
                className="text-[9px] font-bold uppercase px-2 py-1 text-gray-500 hover:text-gray-800 cursor-pointer"
                disabled={loggingOut}
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className={`text-[9px] font-bold uppercase px-3 py-1 rounded text-white cursor-pointer ${
                  loggingOut ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loggingOut ? "Saliendo..." : "Confirmar"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FILAS DINÁMICAS N-NIVELES */}
      {rows.map((row, idx) => {
        if (row.level === 0) {
          return (
            <div key={idx} className="flex justify-center flex-wrap gap-7 mt-2 pb-2 border-b border-gray-100 px-4">
              {row.nodes.map((node) => {
                const isActive = row.activeNode?.id === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => handleSelect(node, row.level)}
                    className={`text-xs tracking-[0.14em] uppercase border-b-2 px-1 pb-1 cursor-pointer transition-colors ${getNodeColorClass(
                      node,
                      isActive
                    )}`}
                  >
                    {node.nombre}
                  </button>
                );
              })}
            </div>
          );
        } else if (row.level === 1) {
          return (
            <div key={idx} className="w-full bg-gray-50 border-b border-gray-100">
              <div className="flex justify-center flex-wrap gap-6 py-2 px-4">
                {row.nodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => handleSelect(node, row.level)}
                    className={`text-[11px] font-bold uppercase cursor-pointer transition-colors ${
                      row.activeNode?.id === node.id
                        ? "text-amber-800 font-extrabold"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {node.nombre}
                  </button>
                ))}
              </div>
            </div>
          );
        } else {
          return (
            <div key={idx} className="flex justify-center flex-wrap gap-3 py-2 bg-white border-b border-gray-100 px-4">
              {row.nodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => handleSelect(node, row.level)}
                  className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border cursor-pointer transition-all ${
                    row.activeNode?.id === node.id
                      ? "bg-amber-900 text-white border-amber-900 shadow-sm"
                      : "text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-800"
                  }`}
                >
                  {node.nombre}
                </button>
              ))}
            </div>
          );
        }
      })}
    </div>
  );
}
