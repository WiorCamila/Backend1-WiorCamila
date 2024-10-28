import { Router } from 'express';
import { ProductsManager } from '../dao/ProductsManager.js';

export const router=Router()

ProductsManager.setPath("./src/data/productos.json")


router.get('/', async (req, res) => {
    try {
        const products = await ProductsManager.getProducts()
        res.render('index', { products })
    } catch (error) {
        console.error('Error al cargar los productos:', error)
        res.status(500).send('Error al cargar los productos')
    }
});
