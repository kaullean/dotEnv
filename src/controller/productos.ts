import { Request, Response, NextFunction, query } from 'express';
import { ProductQuery } from '../models/products/products.interface';
import { productsAPI } from '../apis/productos'

class Producto {

  isAproduct(req: Request, res: Response, next: NextFunction){
    if(
      !req.body.nombre ||req.body.nombre===''||
      !req.body.descripcion ||req.body.descripcion===''||
      !req.body.codigo ||req.body.codigo===''||
      !req.body.fotoUrl ||req.body.fotoUrl===''||
      !req.body.precio ||req.body.precio===NaN||
      !req.body.stock ||req.body.stock===NaN||
      
      typeof req.body.nombre != typeof String() ||
      typeof req.body.descripcion != typeof String() ||
      typeof req.body.codigo !=typeof String() ||
      typeof req.body.fotoUrl != typeof String() ||
      typeof req.body.precio != typeof Number() ||
      typeof req.body.stock != typeof Number() 
  
    ){
        return res.status(404).json({
            msg:"Formato de archivo incorrecto, corroborar atributos y tipos de dato"
        })
    }

    next()  
  }
  async hayProductos(req: Request, res: Response, next: NextFunction){
    const productos = await productsAPI.getProducts();
    
    if (!productos.length) {
          return res.status(404).json({
            msg: 'No hay productos cargados en el sistema',
          });
        }
    next();
  }
  async productExists(req: Request, res: Response, next: NextFunction){
    const {id} = req.params;
    const producto = await productsAPI.getProducts(id)
    if (!producto.length) {
      return res.status(404).json({
        msg: 'Producto no encontrado',
      });
    }
    next();
  }
  /*
  Obtiene desde la persistancia de productos el producto que coincide con el id o, si no se pasa un producto por params
  responde con todo el array de los mismos
  */
  async getProducts(req: Request, res: Response) {
    const {id}=req.params;
    const { nombre, stockMin , stockMax , precioMin , precioMax, codigo } = req.query;
    if (id) {
      return res.json({
        data: await productsAPI.getProducts(id),
      });
    }
    
    const query: ProductQuery ={};

    if(nombre) query.nombre = nombre.toString();
    if(codigo) query.codigo = codigo.toString();
    if(stockMin) query.stockMin = Number(stockMin);
    if(stockMax) query.stockMax = Number(stockMax);
    if(precioMin) query.precioMin = Number(precioMin);
    if(precioMax) query.precioMax = Number(precioMax);


    if(Object.keys(query).length){
      const productos = await productsAPI.query(query);

      if (!productos.length) {
        return res.status(404).json({
          msg: 'Producto no encontrado',
        });
      }
      return res.json({
        data: productos,
      });
    }

    return res.json({
      data: await productsAPI.getProducts(),
    });
  }
  /*
    persiste el archivo enviado en el array de productos del sistema
  */
  async addProducts(req: Request, res: Response) {
    const newItem = await productsAPI.addProduct(req.body);

    return res.json({
      msg: 'producto agregado con exito',
      data: newItem,
    });
  }
  /*
    Actualiza el producto de la base de datos que corresponde al id enviado
  */ 
  async updateProducts(req: Request, res: Response) {
    const {id} = req.params;
    const updatedProduct= await productsAPI.updateProduct(id, req.body)
    return res.json({
      msg: 'Producto Actualizado',
      data: updatedProduct
    });
  }
  /*
    Elmina el producto de la base de datos que corresponde al id enviado
  */ 
  async deleteProducts(req: Request, res: Response) {
    
    const {id} = req.params;

    const deletedProduct=await productsAPI.deleteProduct(id);
    console.log(deletedProduct);
    
    return res.json({
      msg: 'producto borrado',
      data: deletedProduct
    });
  }
}

export const productosController = new Producto();