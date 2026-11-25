// ======================================================
// 📦 ESTRUCTURA ORGANIZACIONAL GPTW 2026 OFICIAL
// ======================================================
// 1 a 36 mapeado exactamente al mapa mental oficial:
// 1 MBC
// 2 DIRECCION (3 CALIDAD, 4 COMPRAS, 5 PRODUCTO TERMINADO: 6 PT, 7 AREA COMERCIAL, 8 CENTRO DE ANALISIS)
// 9 ADMINISTRACION
// 10 OPERACIONES (11 BOTAS: 12 BOTAS I -> 13 CORTE, 14 BORDADO, 15 LASER, 16 PRELIMINARES, 17 PESPUNTE | 18 BOTAS II -> 19 AVIOS, 20 MONTADO, 21 ACABADO, 22 ADORNO; 23 ACCESORIOS -> 24 CINTOS, 25 BILLETERAS, 26 CHAMARRAS, 27 BOLSAS; 28 MAQUILAS; 29 DESARROLLO; 30 INGENIERIAS; 31 MANTENIMIENTO)
// 32 RECURSOS HUMANOS (33 CAPITAL HUMANO, 34 SEGURIDAD E HIGIENE)
// 35 DISEÑO
// 36 IMAGEN
// ESQUEMA (Mapa general con esquema.jpg)
// ======================================================

export interface NodeDefinition {
  nombre: string;
  orden: number;
  image?: string;
  tipoEspecial?: "mbc" | "esquema";
  children?: NodeDefinition[];
}

export const ESTRUCTURA_2026: NodeDefinition[] = [
  // ==================================================
  // 1. MBC (Resultado general de la empresa - Color Café)
  // ==================================================
  {
    nombre: "MBC",
    orden: 1,
    image: "1.png",
    tipoEspecial: "mbc",
  },

  // ==================================================
  // 2. DIRECCIÓN
  // ==================================================
  {
    nombre: "DIRECCION",
    orden: 2,
    image: "2.png",
    children: [
      {
        nombre: "CALIDAD",
        orden: 1,
        image: "3.png",
      },
      {
        nombre: "COMPRAS",
        orden: 2,
        image: "4.png",
      },
      {
        nombre: "PRODUCTO TERMINADO",
        orden: 3,
        image: "5.png",
        children: [
          {
            nombre: "PRODUCTO TERMINADO",
            orden: 1,
            image: "6.png",
          },
          {
            nombre: "AREA COMERCIAL",
            orden: 2,
            image: "7.png",
          },
          {
            nombre: "CENTRO DE ANALISIS",
            orden: 3,
            image: "8.png",
          },
        ],
      },
    ],
  },

  // ==================================================
  // 9. ADMINISTRACION
  // ==================================================
  {
    nombre: "ADMINISTRACION",
    orden: 9,
    image: "9.png",
  },

  // ==================================================
  // 10. OPERACIONES
  // ==================================================
  {
    nombre: "OPERACIONES",
    orden: 10,
    image: "10.png",
    children: [
      {
        nombre: "BOTAS",
        orden: 1,
        image: "11.png",
        children: [
          {
            nombre: "BOTAS I",
            orden: 1,
            image: "12.png",
            children: [
              { nombre: "CORTE", orden: 1, image: "13.png" },
              { nombre: "BORDADO", orden: 2, image: "14.png" },
              { nombre: "LASER", orden: 3, image: "15.png" },
              { nombre: "PRELIMINARES", orden: 4, image: "16.png" },
              { nombre: "PESPUNTE", orden: 5, image: "17.png" },
            ],
          },
          {
            nombre: "BOTAS II",
            orden: 2,
            image: "18.png",
            children: [
              { nombre: "AVIOS", orden: 1, image: "19.png" },
              { nombre: "MONTADO", orden: 2, image: "20.png" },
              { nombre: "ACABADO", orden: 3, image: "21.png" },
              { nombre: "ADORNO", orden: 4, image: "22.png" },
            ],
          },
        ],
      },
      {
        nombre: "ACCESORIOS",
        orden: 2,
        image: "23.png",
        children: [
          { nombre: "CINTOS", orden: 1, image: "24.png" },
          { nombre: "BILLETERAS", orden: 2, image: "25.png" },
          { nombre: "CHAMARRAS", orden: 3, image: "26.png" },
          { nombre: "BOLSAS", orden: 4, image: "27.png" },
        ],
      },
      {
        nombre: "MAQUILAS",
        orden: 3,
        image: "28.png",
      },
      {
        nombre: "DESARROLLO",
        orden: 4,
        image: "29.png",
      },
      {
        nombre: "INGENIERIAS",
        orden: 5,
        image: "30.png",
      },
      {
        nombre: "MANTENIMIENTO",
        orden: 6,
        image: "31.png",
      },
    ],
  },

  // ==================================================
  // 32. RECURSOS HUMANOS
  // ==================================================
  {
    nombre: "RECURSOS HUMANOS",
    orden: 32,
    image: "32.png",
    children: [
      {
        nombre: "CAPITAL HUMANO",
        orden: 1,
        image: "33.png",
      },
      {
        nombre: "SEGURIDAD E HIGIENE",
        orden: 2,
        image: "34.png",
      },
    ],
  },

  // ==================================================
  // 35. DISEÑO
  // ==================================================
  {
    nombre: "DISEÑO",
    orden: 35,
    image: "35.png",
  },

  // ==================================================
  // 36. IMAGEN
  // ==================================================
  {
    nombre: "IMAGEN",
    orden: 36,
    image: "36.png",
  },

  // ==================================================
  // ESQUEMA (Mapa Completo - Color Negro)
  // ==================================================
  {
    nombre: "ESQUEMA",
    orden: 99,
    image: "esquema.jpg",
    tipoEspecial: "esquema",
  },
];

// ======================================================
// 👤 USUARIOS (Solo los 3 requeridos)
// ======================================================
export const USUARIOS = [
  // 1. EDGAR - Acceso TOTAL a todo el sistema
  {
    username: "EDGAR",
    password: "Antillon",
    nombre: "Edgar Carrillo Antillón",
    role: "NIVEL 1",
    permisos: [], // Nivel 1 ve absolutamente todo
  },

  // 2. PAZ LUNA - Todo en OPERACIONES
  {
    username: "Paz_Luna",
    password: "Paz123",
    nombre: "María de la Paz Luna Sotelo",
    role: "NIVEL 3",
    permisos: ["OPERACIONES"],
  },

  // 3. LUCIA - Todo en ADMINISTRACION
  {
    username: "Lucia",
    password: "Lucia123",
    nombre: "Lucía Franco Barba",
    role: "NIVEL 3",
    permisos: ["ADMINISTRACION"],
  },
];
