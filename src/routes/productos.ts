import { Router } from 'express'
import { checkAdmin} from '../middleware/admin';
import { productosController } from '../controller/productos'
import asyncHandler from 'express-async-handler'

const miRouter = Router();



miRouter.get(
    '/listar',
    asyncHandler(productosController.hayProductos),
    asyncHandler(productosController.getProducts)
);

miRouter.get(
    '/listar/:id',
    asyncHandler(productosController.hayProductos),
    asyncHandler(productosController.productExists),
    asyncHandler(productosController.getProducts)
);

miRouter.post(
    '/agregar',
    checkAdmin,
    productosController.isAproduct,
    asyncHandler(productosController.addProducts)
);

miRouter.put(
    '/actualizar/:id',
    checkAdmin,
    asyncHandler(productosController.hayProductos),
    asyncHandler(productosController.productExists),
    asyncHandler(productosController.isAproduct),    
    asyncHandler(productosController.updateProducts)
);

miRouter.delete(
    '/borrar/:id',
    checkAdmin,
    asyncHandler(productosController.hayProductos),
    asyncHandler(productosController.productExists),
    asyncHandler(productosController.deleteProducts)
);

export default miRouter;