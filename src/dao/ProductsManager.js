import fs from "fs"

export class ProductsManager{
    static #path=""

    static setPath(rutaArchivo=""){
        this.#path=rutaArchivo
    }

    static async getProducts(){
        if(fs.existsSync(this.#path)){
            return JSON.parse(await fs.promises.readFile(this.#path, {encoding:"utf-8"}))
        }else{
            return []
        }
    }

    static async #grabaArchivo(datos=""){
        if(typeof datos!="string"){
            throw new Error(`error método grabaArchivo - argumento con formato inválido`)
        }
        await fs.promises.writeFile(this.#path, datos)
    }

    static async addProductos(producto={}){
        let productos=await this.getProducts()
        let nuevoProductos={ 
            ...producto
        }
        productos.push(nuevoProductos)
        await this.#grabaArchivo(JSON.stringify(productos, null, 4))
        return nuevoProductos
    }


    static async actualizadorDeProductos(productos = []) {
        if (!Array.isArray(productos)) {
            throw new Error(`Error en método actualizadorDeProductos - se esperaba un array`)
        }

        await this.#grabaArchivo(JSON.stringify(productos, null, 4));
        console.log('Productos actualizados correctamente');
    }
}