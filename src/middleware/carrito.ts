// import { Request, Response, NextFunction } from 'express';

// /*
//   Este archivo contiene middlewares que se encargaran de realizar comprobaciones a los productos del carrito.
// */

// //Comprueba que el producto solicitado exista
// export const productExistsEnCarrito = (req: Request, res: Response, next: NextFunction) => {
//   const id = parseInt(req.params.id);

//   if (carritoPersistencia.find(id) === undefined) {
//     return res.status(404).json({
//       msg: 'Producto no encontrado en el carrito',
//     });
//   }
//   next();
// }
// //Comprueba si hay productos
// export const hayProductosEnCarrito=(req: Request, res: Response, next: NextFunction) => {
  
//   if (carritoPersistencia.get().length==0) {
//         return res.status(404).json({
//           msg: 'No hay productos en tu carrito',
//         });
//       }
//   next();
// }




