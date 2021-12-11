// import { Request, Response, NextFunction } from 'express';
// // import { carritoPersistencia } from '../presistencia/carrito';
// // import { productsPersistencia } from '../presistencia/productos';
// /*Logica de las rutas de carrito*/

// class Carrito {

//   /*
//   Obtiene desde la persistancia de carrito el producto del carrito actual que coincide con el id o, si no se pasa un producto por params
//   responde con todo el array de productos del carrito
//   */
  
//   getCarrito(req: Request, res: Response) {
//     const id = parseInt(req.params.id);

//     const productosDelCarrito = id

//       ? carritoPersistencia.get(id)
//       : carritoPersistencia.get();

    
//     res.json({
//       data: productosDelCarrito,
//     });
//   }
//   /*
//     persiste el archivo enviado en el array de productos del carrito actual
//   */
//   addProductsCarrito(req: Request, res: Response) {

//     const id =parseInt(req.params.id)

//     const producto = productsPersistencia.get(id);
//     const elProducto =producto[0];//parseo cabeza para que typescript no me moleste con el tipo de dato

//     const newItem = carritoPersistencia.add(elProducto)

//     res.json({
//       msg: 'producto agregado con exito',
//       data: newItem,
//     });
//   }

//   /*
//     Elmina el producto de del carrito actual que corresponde al id enviado
//   */

//   deleteProductsCarrito(req: Request, res: Response) {


//     const id = parseInt(req.params.id);

//     let productoBorrado=carritoPersistencia.delete(id);
//     res.json({
//       msg: 'producto borrado',
//       productoBorrado:productoBorrado
//     });
//   }
// }

// export const carritoController = new Carrito();