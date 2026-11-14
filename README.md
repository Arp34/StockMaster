# StockMaster · Gestión de inventario

Interfaz web para gestionar el inventario de una tienda, que consume una API REST simulada con `json-server`. Proyecto formativo de Riwi.

## Qué hace

- Lista los productos con **paginación** (anterior / siguiente).
- **Crea productos** nuevos desde un formulario (nombre, descripción, existencias y precio).
- Muestra un **resumen del inventario**: número de productos, valor total y productos con stock crítico.
- Pendiente: editar y eliminar productos.

## Tecnologías

JavaScript (ES6+) · HTML · Tailwind CSS · Vite · json-server

## Cómo ejecutarlo

Requisitos: Node.js 18 o superior. Hacen falta dos terminales.

**1. API simulada** (queda en `http://localhost:3000/productos`):

```bash
cd api
npm install
npm test
```

**2. Cliente:**

```bash
cd client
npm install
npm run dev
```

Abre la dirección que muestra Vite en la terminal.

## Estructura

```
api/
  database.json     Datos de los productos (los usa json-server)
client/
  index.html        Interfaz
  src/main.js       Peticiones a la API, pintado de la tabla, paginación y resumen
  src/styles/       Estilos (Tailwind CSS)
```

## Autor

**Axel Ruiz Polo** · Desarrollador Full Stack Junior · [Portafolio](https://arp34.github.io/) · [LinkedIn](https://www.linkedin.com/in/axel-ruiz-polo/)
