// Escuchar la lista de productos desde el servidor y renderizarla
socket.on("products", (products) => {
    const listaProductos = document.getElementById('listaProductos')
    listaProductos.innerHTML = '';

    products.forEach((product) => {
        const li = document.createElement("li")
        li.innerHTML = `
            <h2>${product.title}</h2>
            <p>Descripción: ${product.description}</p>
            <p>Precio: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <button onclick="eliminarProducto(${product.id})">Eliminar</button>
        `;
        listaProductos.appendChild(li);
    });
});

document.getElementById("agregar-productos").addEventListener('submit', async (e) => {
    e.preventDefault()

    const title = document.getElementById("title").value.trim()
    const description = document.getElementById("description").value.trim()
    const price = parseFloat(document.getElementById("price").value.trim())
    const code = document.getElementById("code").value.trim()
    const stock = parseInt(document.getElementById("stock").value.trim())

    // Validaciones
    if (!title) {
        return Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "El título es requerido."
        });
    }
    if (!description) {
        return Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "La descripción es requerida."
        });
    }
    if (isNaN(price) || price <= 0) {
        return Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "El precio debe ser un número mayor que cero."
        });
    }
    if (!code) {
        return Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "El código es requerido."
        });
    }
    if (isNaN(stock) || stock < 0) {
        return Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "El stock debe ser un número mayor o igual a cero."
        });
    }

    socket.emit("crearProductos", { title, description, price, stock, code })

    e.target.reset();
    socket.on('success', (mensajeExito) => {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: mensajeExito,
            confirmButtonText: 'Aceptar'
        });
    });
});


const eliminarProducto = async (id) => {
    try {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminarlo!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            socket.emit('eliminarProducto', id)

            socket.on('productoEliminado', mensajeExito => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: mensajeExito,
                    confirmButtonText: 'Aceptar'
                })
            })
        }
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json')
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
        
    }
}
