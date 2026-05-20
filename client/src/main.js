import './styles/globals.css';

const endpoint = "http://localhost:3000/productos"

const guardarProducto = document.getElementById("btn-send")
const limpiarForm = document.getElementById("btn-cancel")
const formulario = document.getElementById("product-form")

const btnSiguiente = document.getElementById("btn-next")
const btnAnterior = document.getElementById("btn-prev")

let paginaActual = 1
const productosPorPagina = 5

// =========================
// TRAER DATOS
// =========================

async function traeDatos() {

    try {

        const response = await fetch(endpoint)

        if (!response.ok) {
            throw new Error("Error al obtener productos")
        }

        const productos = await response.json()

        pintarLosDAtos(productos, paginaActual)
        actualizarResumen(productos)
        actualizarPaginacion(productos)

    } catch (error) {

        console.error(error)
        alert("No se pudieron cargar los productos")

    }

}

traeDatos()

// =========================
// EVENTOS
// =========================

formulario.addEventListener("submit", agregarProducto)

limpiarForm.addEventListener("click", () => {
    formulario.reset()
})

// =========================
// PINTAR DATOS
// =========================

function pintarLosDAtos(productos, pagina) {

    const lugarDeImpresion = document.getElementById("inventory-list")

    lugarDeImpresion.innerHTML = ``

    const inicio = (pagina - 1) * productosPorPagina
    const final = inicio + productosPorPagina

    const productosPaginados = productos.slice(inicio, final)

    for (const producto of productosPaginados) {

        lugarDeImpresion.innerHTML += `

        <tr class="hover:bg-slate-50/30 transition-colors group">

            <td class="px-8 py-6">
                <div class="flex flex-col">

                    <span class="font-bold text-slate-900">
                        ${producto.nombre}
                    </span>

                    <span class="text-xs text-slate-400 mt-1 line-clamp-1 max-w-[300px]">
                        ${producto.descripcion || "Sin descripción"}
                    </span>

                </div>
            </td>

            <td class="px-8 py-6 text-center">

                <span class="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-tight border border-emerald-100">
                    ${producto.existencias} Unidades
                </span>

            </td>

            <td class="px-8 py-6 text-center font-bold text-slate-900">
                $ ${producto.precioUnit}
            </td>

            <td class="px-8 py-6 text-right">
                <div class="flex justify-end gap-3">

                    <button class="w-10 h-10 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100" title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                            <path stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>

                    <button class="w-10 h-10 flex items-center justify-center text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100" title="Eliminar">
                        <svg xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                            <path stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>

                </div>
            </td>

        </tr>

        `
    }

}

// =========================
// AGREGAR PRODUCTO
// =========================

async function agregarProducto(event) {

    event.preventDefault()

    const nombre = document.getElementById("nombre").value.trim()
    const precioUnit = document.getElementById("precio").value.trim()
    const existencias = document.getElementById("stock").value.trim()
    const descripcion = document.getElementById("descripcion").value.trim()

    // VALIDACIONES

    if (
        !nombre ||
        !precioUnit ||
        !existencias ||
        !descripcion
    ) {

        alert("Todos los campos son obligatorios")
        return
    }

    if (Number(precioUnit) <= 0) {

        alert("El precio debe ser mayor a 0")
        return
    }

    if (Number(existencias) < 0) {
        
        alert("El stock no puede ser negativo")
        return
    }

    const nuevoProducto = {

        nombre,
        descripcion,
        existencias: Number(existencias),
        precioUnit: Number(precioUnit),

    }

    try {

        const response = await fetch(endpoint, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(nuevoProducto)

        })

        if (!response.ok) {
            throw new Error("No se pudo guardar")
        }

        alert("Producto guardado correctamente")

        formulario.reset()

        traeDatos()

    } catch (error) {

        console.error(error)
        alert("Ocurrió un error al guardar")

    }

}

// =========================
// RESUMEN
// =========================

function actualizarResumen(productos) {

    const totalProductos = productos.length

    let valorTotal = 0
    let stockCritico = 0

    for (const producto of productos) {

        valorTotal += producto.precioUnit * producto.existencias

        if (producto.existencias <= 5) {
            stockCritico++
        }

    }

    document.getElementById("stat-total").textContent = totalProductos
    document.getElementById("stat-value").textContent = `$ ${valorTotal}`
    document.getElementById("stat-low").textContent = stockCritico

}

// =========================
// PAGINACION
// =========================

function actualizarPaginacion(productos) {

    const totalPaginas = Math.ceil(productos.length / productosPorPagina)

    document.getElementById("pagination-info").textContent =
        `Página ${paginaActual} de ${totalPaginas || 1}`

    btnAnterior.disabled = paginaActual === 1
    btnSiguiente.disabled = paginaActual === totalPaginas

}

// =========================
// BOTON SIGUIENTE
// =========================

btnSiguiente.addEventListener("click", async () => {

    try {

        const response = await fetch(endpoint)
        const productos = await response.json()

        const totalPaginas = Math.ceil(productos.length / productosPorPagina)

        if (paginaActual < totalPaginas) {

            paginaActual++

            pintarLosDAtos(productos, paginaActual)
            actualizarPaginacion(productos)

        }

    } catch (error) {

        console.error(error)

    }

})

// =========================
// BOTON ANTERIOR
// =========================

btnAnterior.addEventListener("click", async () => {

    try {

        if (paginaActual > 1) {

            paginaActual--

            const response = await fetch(endpoint)
            const productos = await response.json()

            pintarLosDAtos(productos, paginaActual)
            actualizarPaginacion(productos)

        }

    } catch (error) {

        console.error(error)

    }

})