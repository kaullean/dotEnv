import { Router } from 'express'
import productosRouter from './productos'
//import carritoRouter from './carrito'

const miRouter = Router();

miRouter.use('/productos', productosRouter)
//miRouter.use('/carrito', carritoRouter)


export default miRouter;