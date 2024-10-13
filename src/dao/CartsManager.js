import fs from 'fs';

export class CartsManager{
    
    static #path = ''

    static setPath(rutaArchivo = '') {
        this.#path = rutaArchivo;
    }

    static async getCarts(){
        if(fs.existsSync(this.#path)){
            return JSON.parse(await fs.promises.readFile(this.#path, {encoding:"utf-8"}))
        }else{
            return []
        }
    }

    static async #grabaArchivo(datos = '') {
        if (typeof datos != 'string') {
            throw new Error(`error método grabaArchivo - argumento con formato inválido`)
        }
        await fs.promises.writeFile(this.#path, datos)
    }

    static async addCart(cart = {}) {
        let carritos = await this.getCarts()

        carritos.push(cart)
        await this.#grabaArchivo(JSON.stringify(carritos, null, 4))
        return cart
    }

    static async actualizadorDeCarritos(cart = []) {
        if (!Array.isArray(cart)) {
            throw new Error(`Error en método actualizadorDeCarritos - se esperaba un array`)
        }

        await this.#grabaArchivo(JSON.stringify(cart, null, 4));
        console.log('Carrito actualizados correctamente')
    }
    
}
