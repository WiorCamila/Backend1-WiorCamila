import express from 'express';
import {engine} from "express-handlebars"
import { router as productsRouter} from './routes/productsRouter.js';
import { router as cartsRouter } from './routes/carts.js';
import { router as vistasRouter } from './routes/vistasRouter.js';
import {Server} from "socket.io"
import { ProductsManager } from './dao/ProductsManager.js';

const PORT=8080;

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
//Contenido estatico
app.use(express.static("./src/public"))

//express-handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

//Router
app.use("/", vistasRouter)
app.use('/api/products', productsRouter);

app.use('/api/carts', cartsRouter);


const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});

const io=new Server(server)

io.on("connection", async socket => {
    console.log(`Cliente conectado con Id: ${socket.id}`)

    socket.on("crearProductos", async nuevoProducto => {
        const productos = await ProductsManager.getProducts()

        let id = 1
        if (productos.length > 0) {
            id = productos[productos.length - 1].id + 1
        }
        const productsId = { id, ...nuevoProducto }
        productos.push(productsId)

        await ProductsManager.actualizadorDeProductos(productos)
        io.emit("products", productos)

        socket.emit("success", "El producto se ha agregado exitosamente.")
    });

    socket.on("eliminarProducto", async productId => {
        let productos = await ProductsManager.getProducts();
        productos = productos.filter(p => p.id !== productId);
        await ProductsManager.actualizadorDeProductos(productos);
        io.emit("products", productos);
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});

