"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function HeaderMobile({ user }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [loggingOut, setLoggingOut] = useState(false);

  const fetchMenu = useCallback(() => {
    if (!user?.username) return;

    fetch(`/api/menu?username=${encodeURIComponent(user.username)}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => Array.isArray(data) && setMenu(data))
      .catch((err) => console.error("Error al cargar menú móvil:", err));
  }, [user]);

  useEffect(() => {
    fetchMenu();

    const handleUpdate = () => {
      fetchMenu();
    };

    window.addEventListener("mbc_system_updated", handleUpdate);
    return () => window.removeEventListener("mbc_system_updated", handleUpdate);
  }, [fetchMenu]);

  const handleLogout = () => {
    if (loggingOut) return;
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("usuario_mbc");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      router.push("/login");
    }, 400);
  };

  const seleccionarReporte = (imageName) => {
    if (imageName) {
      router.push(`/dashboard?view=${imageName}`);
      setOpen(false);
    }
  };

  const toggleExpand = (nodeId) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const getNodeColorClassMobile = (node) => {
    if (node.tipoEspecial === "mbc") return "text-[#78350f] font-black";
    if (node.tipoEspecial === "esquema") return "text-black font-black";
    return "text-gray-900 font-bold";
  };

  const renderMobileNode = (node, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);

    return (
      <div key={node.id} className={`border-b border-gray-100 ${depth > 0 ? "pl-4 bg-gray-50/50" : ""}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => {
              if (node.imageName) {
                seleccionarReporte(node.imageName);
              } else if (hasChildren) {
                toggleExpand(node.id);
              }
            }}
            className={`text-left text-xs uppercase flex-1 ${
              depth === 0 ? getNodeColorClassMobile(node) : depth === 1 ? "text-amber-900 font-bold" : "text-gray-600 font-medium"
            }`}
          >
            {node.nombre}
          </button>

          {hasChildren && (
            <button
              onClick={() => toggleExpand(node.id)}
              className="p-1 text-gray-500 hover:text-gray-800 text-xs px-2"
            >
              {isExpanded ? "▲" : "▼"}
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="pb-2">
            {node.children.map((child) => renderMobileNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="lg:hidden bg-white w-full shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 text-gray-700 rounded-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <img src="/img/GPTW.webp" alt="GPTW" className="h-10 w-auto opacity-90" />
          <img src="/img/01_Cuadra.webp" alt="Cuadra" className="h-7 w-auto" />
        </div>

        <div className="text-xs font-bold text-gray-700 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
          {user?.nombre?.charAt(0)}
        </div>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute top-full left-0 w-full bg-white z-50 shadow-xl max-h-[85vh] flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-xs font-bold uppercase">{user?.nombre}</p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {menu.map((rootNode) => renderMobileNode(rootNode, 0))}
            </div>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className={`w-full py-3 rounded-lg text-xs font-bold uppercase text-white transition-colors ${
                  loggingOut ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
