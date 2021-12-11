import { newProduct, Product } from '../models/products/products.interface';
import { NoticiasFactoryDAO } from '../models/products/products.factory';
import { TipoPersistencia } from '../models/products/products.factory';
import { ProductQuery } from '../models/products/products.interface';
import Config from '../config'
/**
 * Con esta variable elegimos el tipo de persistencia
 */

const tipo = Config.PERSISTENCIA ;

class prodAPI {
  private productos;

  constructor() {
    this.productos = NoticiasFactoryDAO.get(tipo);
  }

  async getProducts(id: string | undefined = undefined): Promise<Product[]> {
    if (id) return this.productos.get(id);

    return this.productos.get();
  }

  async addProduct(productData: newProduct): Promise<Product> {
    const newProduct = await this.productos.add(productData);
    return newProduct;
  }

  async updateProduct(id: string, productData: newProduct) {
    const updatedProduct = await this.productos.update(id, productData);
    return updatedProduct;
  }

  async deleteProduct(id: string) {
    return await this.productos.delete(id);
  }

  async query(options: ProductQuery) {
    return await this.productos.query(options);
  }
}

export const productsAPI = new prodAPI();