"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [password, setPassword] = useState("");

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bgImage, setBgImage] = useState("");

  const dropdownRef = useRef(null);

  // Fondo dinámico
  useEffect(() => {
    const updateBackground = () => {
      setBgImage(window.innerWidth >= 1024 ? "/img/A2.webp" : "/img/2.webp");
    };

    updateBackground();
    window.addEventListener("resize", updateBackground);
    return () => window.removeEventListener("resize", updateBackground);
  }, []);

  // Cargar lista de usuarios para el selector
  useEffect(() => {
    fetch("/api/auth/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsuarios(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingUsers(false));
  }, []);

  // Cerrar dropdown si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtrar usuarios en tiempo real por nombre o username
  const filteredUsers = usuarios.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      setError("Por favor selecciona tu nombre de la lista");
      return;
    }
    if (!password) {
      setError("Por favor introduce tu contraseña");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: selectedUser.username,
          password: password,
        }),
      });

      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("usuario_mbc", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        setError(data.message || "Contraseña incorrecta");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay con desenfoque elegante */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* CONTENEDOR MODAL */}
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full p-6 sm:p-8 border border-gray-100">
          
          {/* LOGOS */}
          <div className="flex items-center justify-center gap-6 mb-5">
            <img
              src="/img/GPTW.webp"
              alt="Great Place To Work"
              className="w-[60px] opacity-90"
            />
            <img
              src="/img/01_Cuadra.webp"
              alt="Cuadra"
              className="w-[150px] drop-shadow-md"
            />
          </div>

          <h2 className="text-xl font-black text-center text-amber-950 mb-1 tracking-tight">
            Clima Laboral 2026
          </h2>
          <p className="text-xs text-center text-gray-400 mb-6 font-medium">
            Selecciona tu nombre para ingresar
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200 flex items-center gap-2 animate-shake">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* SELECT CON BUSCADOR INTEGRADO */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Colaborador / Usuario
              </label>

              {/* Botón que despliega el menú */}
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`w-full border rounded-xl px-3.5 py-2.5 flex items-center justify-between cursor-pointer bg-gray-50/50 hover:bg-white transition-all ${
                  dropdownOpen
                    ? "border-amber-900 ring-2 ring-amber-900/10 bg-white"
                    : "border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-7 h-7 rounded-full bg-amber-900/10 text-amber-950 font-bold text-xs flex items-center justify-center shrink-0">
                    {selectedUser ? (
                      selectedUser.nombre.charAt(0)
                    ) : (
                      <svg className="w-4 h-4 text-amber-950/70" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm truncate ${selectedUser ? "font-bold text-gray-800" : "text-gray-400 font-medium"}`}>
                    {selectedUser ? selectedUser.nombre : (loadingUsers ? "Cargando usuarios..." : "Elige tu nombre...")}
                  </span>
                </div>

                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180 text-amber-900" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* MENÚ FLOTANTE CON BUSCADOR */}
              {dropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-fadeIn">
                  {/* Buscador interno */}
                  <div className="p-2 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 shrink-0 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Buscar por nombre..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      className="w-full bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none py-1"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="text-gray-400 hover:text-gray-600 text-xs px-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Lista de opciones filtradas */}
                  <div className="max-h-56 overflow-y-auto divide-y divide-gray-50">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => (
                        <div
                          key={u.id}
                          onClick={() => {
                            setSelectedUser(u);
                            setDropdownOpen(false);
                            setSearchQuery("");
                          }}
                          className={`px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-amber-50/70 transition-colors ${
                            selectedUser?.id === u.id ? "bg-amber-100/60" : ""
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold text-gray-900 leading-tight">
                              {u.nombre}
                            </p>
                          </div>
                          {selectedUser?.id === u.id && (
                            <svg className="w-4 h-4 text-amber-900" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-xs text-gray-400">
                        No se encontró ningún colaborador con ese nombre.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CAMPO CONTRASEÑA */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900 focus:outline-none transition-all"
              />
            </div>

            {/* BOTÓN ENTRAR */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-2 py-3 rounded-xl font-bold text-sm tracking-wider uppercase text-white shadow-lg transition-all cursor-pointer ${
                loading
                  ? "bg-gray-400 cursor-not-allowed shadow-none"
                  : "bg-amber-950 hover:bg-amber-900 active:scale-[0.99] shadow-amber-950/20"
              }`}
            >
              {loading ? "Verificando..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
