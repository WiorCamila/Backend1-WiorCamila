import { Router } from 'express';
import { CartsManager } from '../dao/CartsManager.js';
import { ProductsManager } from '../dao/ProductsManager.js';
export const router=Router()

CartsManager.setPath("./src/data/carrito.json")

router.get("/", async(req,res)=>{
    let carrito = await CartsManager.getCarts()

    res.setHeader('Content-Type','application/json')
    return res.status(200).json({carrito});
})

router.get("/:cid", async (req, res) => {
    const { cid } = req.params

    try {
        let carritos = await CartsManager.getCarts();
        const carrito = carritos.find(c => c.id === Number(cid))

        if (!carrito) {
            return res.status(404).json({ error: `Carrito con id ${cid} no encontrado` })
        }

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ carrito })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
            detalle: `${error.message}`
        })
    }
})


router.post("/", async (req, res) => {
    try {
        const { nombre } = req.body
        const carritos = await CartsManager.getCarts()
        let id = carritos.length > 0 ? carritos[carritos.length - 1].id + 1 : 1
        
        const nuevoCarrito = {
            id: id,
            products: [
                nombre
            ] 
        }

        carritos.push(nuevoCarrito);

        await CartsManager.actualizadorDeCarritos(carritos)

        res.status(201).json(nuevoCarrito)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
            detalle: error.message
        });
    }
});

router.post('/:cid/products/:pid', async (req, res) => { //cid = Numero de id que agrega al carrito / pid = Encuentra el producto y agrega
    const { cid, pid } = req.params
    
    try {
        let carritos = await CartsManager.getCarts()
        const carrito = carritos.find(c => c.id === Number(cid))
        if (!carrito) {
            return res.status(404).json({ error: `No se encontró el carrito con ID ${cid}` })
        }

        const productos = await ProductsManager.getProducts()
        const producto = productos.find(p => p.id === Number(pid))
        if (!producto) {
            return res.status(404).json({ error: `No se encontró el producto con ID ${pid}` })
        }

        const productoEnCarrito = carrito.products.find(p => p.product === Number(pid))

        if (productoEnCarrito) {
            productoEnCarrito.quantity += 1;
        } else {
            carrito.products.push({
                product: Number(pid), 
                quantity: 1 
            });
        }

        await CartsManager.actualizadorDeCarritos(carritos)

        res.status(200).json(carrito);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
            detalle: error.message
        });
    }
});
