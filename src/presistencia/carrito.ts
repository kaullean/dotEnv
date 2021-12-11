// import fs from 'fs'
// import path from 'path'
// import { objToJSON } from '../services/json';
// import { idCarritoBaseDeDatos } from './data';

// /*Path al json publico con los datos del carrito*/
// const publicPathFileProductos = path.resolve(
//   __dirname,
//   '../../public/carrito.json'
// );
// /*Path al json src con los datos de los id de la base de datos*/
// const pathFileProductos = path.resolve(
//   __dirname,
//   './dataDB.json'
// );
// /*Lectura y parse de los datos del carrito.json*/
// let data =fs.readFileSync(publicPathFileProductos, 'utf-8');
// let carrito : CarritoI[]= JSON.parse(data);//creacion de variable local con los datos del JSON

// /*Si el json esta vacio lo inicializa*/
// if(carrito.length===0){
//   let carritoAux: CarritoI={
//     id:idCarritoBaseDeDatos,
//     timestamp:new Date(),
//     productos:[],
//   }
//   carrito.push(carritoAux)
// }
// /*Asigna a una variable local el valor del ultimo id en la base de datos de carritos*/
// let idActual=idCarritoBaseDeDatos;

// interface Product {
//   id: number;
//   timestamp: Date;
//   nombre: string;
//   descripcion: string;
//   codigo: string;
//   fotoUrl: string;
//   precio: number;
//   stock: number;
// }
// interface CarritoI {//interfase de carrito inicializado y vacio
//     id: number;
//     timestamp: Date;
//     productos: Product[] ;
// }


// class Carrito {

//   find(id: number | undefined): Product | undefined | number {
//       let productoEncontrado: Product | undefined=carrito[idCarritoBaseDeDatos-1].productos.find((aProduct) => aProduct.id === id) //lo coloco primero en una variable auxiliar para que ts no tire error 
//       return productoEncontrado;      
//   }
//   /*
//     guarda el carrito en un json
//   */
//   guardarCarritoArchivo() {
//     fs.writeFileSync(publicPathFileProductos, objToJSON(carrito), 'utf-8');
//   }
//   /*
//     Actualiza el json para incrementar el valor del ultimo idDecarrito (falta pulir)
//   */
//   actualizarIdDBCarrito(){
//     let data=fs.readFileSync(pathFileProductos, 'utf-8');
//     let dataParse = JSON.parse(data);
//     dataParse.idCarritoDb=idActual;
//     fs.writeFileSync(pathFileProductos, objToJSON(dataParse), 'utf-8');
//   }
//   /*
//     Devuelve el producto del carrito solicitado (un poco harcodeado para que ts no me asesine)
//   */
//   get(id?: number) {
    
//     let auxCarrito = [{
//         id:carrito[idCarritoBaseDeDatos-1].id,
//         timestamp:carrito[idCarritoBaseDeDatos-1].timestamp,
//         productos:carrito[idCarritoBaseDeDatos-1].productos
//     }];
//     //Si el id existe entonces busco el producto en el carrito
//     if (id) {   
      
//       //utilizo una variable auxiliar para no pisar a la variable con los datos
//       auxCarrito[idCarritoBaseDeDatos-1].productos=auxCarrito[idCarritoBaseDeDatos-1].productos.filter((aProduct) => aProduct.id === id)
      
//       return auxCarrito[idCarritoBaseDeDatos-1].productos;
//     }
    
//     return carrito[idCarritoBaseDeDatos-1].productos;
//   }
//   /*
//     Agrega el producto al carrito actual, lo guarda en el archivo y devuelve el item agregado 
//   */
//   add(data: Product) {

//     const newItem: Product = {
//       id:data.id,
//       timestamp: new Date(),
//       nombre: data.nombre,
//       descripcion: data.descripcion,
//       codigo: data.codigo,
//       fotoUrl: data.fotoUrl,
//       precio: data.precio,
//       stock: data.stock,
//     };
//     carrito[idCarritoBaseDeDatos-1].productos.push(newItem);
//     //this.actualizarIdDBCarrito(); El id del carrito deberia actualizarse por cada nueva conexion
//     this.guardarCarritoArchivo();
//     return newItem;
//   }
//   /*
//     Elimina el producto del carrito actual que coincide con el id
//   */
//   delete(id: number) {
//     let deletedItem=this.find(id);
//     carrito[idCarritoBaseDeDatos-1].productos = carrito[idCarritoBaseDeDatos-1].productos.filter((aProduct) => aProduct.id !== id);
    
//     this.guardarCarritoArchivo();//persiste los datos para actualizar el json
//     return deletedItem;
//   }
// }

// export const carritoPersistencia = new Carrito();