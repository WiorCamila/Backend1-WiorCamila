import { Router } from 'express';
import {ProductsManager} from "../dao/ProductsManager.js"

ProductsManager.path="./src/data/productos.json"
export const router=Router()

router.get('/',(req,res)=>{

    res.render("home")
})

router.get('/products', async (req, res) => {
    try {
        const products = await ProductsManager.getProducts();
        res.render('index', { products });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        res.status(500).send('Error al cargar los productos');
    }
});


router.get('/realtimeproducts', (req, res) => {
    
    res.render('realTimeProducts');
});
