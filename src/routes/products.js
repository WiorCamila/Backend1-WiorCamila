import { Router } from 'express';
import { ProductsManager } from '../dao/ProductsManager.js';

export const router=Router()

ProductsManager.setPath("./src/data/productos.json")


router.get('/', async(req,res)=>{
    let products = await ProductsManager.getProducts()
    let { limit } = req.query
    let respuesta = products

    if(!limit){
        limit=products.length
    }else {
        limit=Number(limit)
        if(isNaN(limit)){
            return res.send(`limit debe ser numérico`)
        }
    }

    respuesta = respuesta.slice(0, limit);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ products: respuesta });
})

router.get('/:pid', async (req, res) => {
    let { pid } = req.params

    pid = Number(pid)
    if (isNaN(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El pid debe ser numérico` })
    }

    try {
        let productos = await ProductsManager.getProducts()
        let product = productos.find(p => p.id === pid)
        if (!product) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).json({ error: `No existe el producto con pid: ${pid}` })
        }

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ product })
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({
            error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle: `${error.message}`
        })
    }
})

router.post('/', async (req, res) => {
    let { title, ...otros } = req.body
    let productos = await ProductsManager.getProducts()

    let id = 1
    if (productos.length > 0) {
        id = productos[productos.length - 1].id + 1
    }

    // Validaciones
    try {
        let existe = productos.find(p => p.title.toLowerCase() === title.toLowerCase())
        if (existe) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: `Ya existe ${title} en Base de datos` })
        }

        let nuevoProducto = {
            id,
            title,
            ...otros
        };

        await ProductsManager.addProductos(nuevoProducto)
        res.setHeader('Content-Type', 'application/json')
        return res.status(201).json({ producto: nuevoProducto })
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
            error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
            detalle: `${error.message}`
        })
    }
})

router.put('/:pid', async (req, res) => {
    const { pid } = req.params
    const actualizaciones = req.body

    const pidNumerico = Number(pid)
    if (isNaN(pidNumerico)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: `El pid debe ser numérico` })
    }

    try {
        let productos = await ProductsManager.getProducts()
        const productoIndex = productos.findIndex(p => p.id === pidNumerico)

        if (productoIndex === -1) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).json({ error: `No se encontró un producto con el id ${pid}` })
        }

        productos[productoIndex] = {
            ...productos[productoIndex], 
            ...actualizaciones, 
            id: productos[productoIndex].id
        }

        await ProductsManager.actualizadorDeProductos(productos)
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ message: `Producto con id ${pid} actualizado`, producto: productos[productoIndex] })

    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
            error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
            detalle: `${error.message}`
        });
    }
})

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params

    try {
        let productos = await ProductsManager.getProducts();
        const productoIndex = productos.findIndex(p => p.id === Number(pid))

        if (productoIndex === -1) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: `No se encontró un producto con el pid ${pid}` })
        }

        productos.splice(productoIndex, 1);

        await ProductsManager.actualizadorDeProductos(productos);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ message: `Producto con pid ${pid} eliminado exitosamente` })

    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
            error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
            detalle: `${error.message}`
        })
    }
})

