import fs from 'fs';
import {
  newProduct,
  Product,
  ProductBaseClass,
  ProductQuery,
} from '../products.interface';

export class ProductosFSDAO implements ProductBaseClass {
  
  private productos: Product[] = [];
  private nombreArchivo: string;
  private ID: string='0';

  constructor(fileName: string) {
   
    const mockData = [
        { _id: this.proximoID(), timestamp:new Date(), nombre: 'lapiz', descripcion:'Lapiz HB negro', codigo: "codigoLapiz", fotoUrl: "url/lapiz", precio: 100,stock:10},
        { _id: this.proximoID(), timestamp:new Date(), nombre: 'goma', descripcion:'goma blanca', codigo: "codigoGoma", fotoUrl: "url/goma", precio: 200,stock:20},
        { _id: this.proximoID(), timestamp:new Date(), nombre: 'calculadora', descripcion:'calculadora cientifica', codigo: "codigoCalculadora", fotoUrl: "url/calculadora", precio: 300,stock:30},
        { _id: this.proximoID(), timestamp:new Date(), nombre: 'escuadra', descripcion:'escuadra 45 grados', codigo: "codigoEscuadra", fotoUrl: "url/escuadra", precio: 400,stock:40},
        { _id: this.proximoID(), timestamp:new Date(), nombre: 'regla', descripcion:'regla 20cm transparente', codigo: "codigoRegla", fotoUrl: "url/regla", precio: 500,stock:50},
        { _id: this.proximoID(), timestamp:new Date(), nombre: 'lapiz', descripcion:'Lapiz HB negro', codigo: "codigoLapiz", fotoUrl: "url/lapiz", precio: 10,stock:10},
        
      ];
    this.nombreArchivo = fileName;
    this.productos = mockData;
    this.guardar();
  }

  proximoID(){ 
    const proximoId=Number(this.ID)+1
    this.ID=proximoId.toString();
    return this.ID;
  }

  async leer(archivo: string): Promise<void> {
    this.productos = JSON.parse(await fs.promises.readFile(archivo, 'utf-8'));
  }

  async guardar(): Promise<void> {
    await fs.promises.writeFile(
      this.nombreArchivo,
      JSON.stringify(this.productos, null, '\t')
    );
  }

  async findIndex(id: string): Promise<number> {
    await this.leer(this.nombreArchivo);
    return this.productos.findIndex((aProduct: Product) => aProduct._id == id);
  }

  async find(id: string): Promise<Product | undefined> {
    await this.leer(this.nombreArchivo);

    return this.productos.find((aProduct) => aProduct._id === id);
  }

  async get(id?: string): Promise<Product[]> {
    await this.leer(this.nombreArchivo);

    if (id) {
      return this.productos.filter((aProduct) => aProduct._id === id);
    }
    return this.productos;
  }

  async add(data: newProduct): Promise<Product> {

    await this.leer(this.nombreArchivo);

    const newItem: Product = {
      _id: (this.productos.length + 1).toString(),
      timestamp:new Date (),
      ...data,
    };

    this.productos.push(newItem);

    await this.guardar();

    return newItem;
  }

  async update(id: string, newProductData: newProduct): Promise<Product> {
    await this.leer(this.nombreArchivo);

    const index = await this.findIndex(id);
    const oldProduct = this.productos[index];

    const updatedProduct: Product = { ...oldProduct, ...newProductData };
    this.productos.splice(index, 1, updatedProduct);

    await this.guardar();

    return updatedProduct;
  }

  async delete(id: string): Promise<Product> {
    await this.leer(this.nombreArchivo);
    
    const index = await this.findIndex(id);
    const deletedProduct=this.productos[index]
    this.productos.splice(index, 1);
    await this.guardar();
    return deletedProduct;
  }

  async query(options: ProductQuery): Promise<Product[]> {

    await this.leer(this.nombreArchivo);
    type Conditions = (aProduct: Product) => boolean;
    const query: Conditions[] = [];
      
    if (options.nombre)
    query.push((aProduct: Product) => aProduct.nombre == options.nombre);

    if (options.codigo)
      query.push((aProduct: Product) => aProduct.codigo == options.codigo);
      

    if (options.precioMin)
      query.push((aProduct: Product) => {
        let aux : boolean = false;
        if(typeof options.precioMin !=="undefined" ){
          aux=aProduct.precio >= options.precioMin;
        } 
        if(typeof options.precioMin !=="undefined" && typeof options.precioMax !== "undefined")           
          aux=aProduct.precio >= options.precioMin && aProduct.precio <= options.precioMax

        return aux;             
    });    
    
    if (options.precioMax)
      query.push((aProduct: Product) => {
        let aux : boolean = false;
        if(typeof options.precioMax !== "undefined" ){
          aux=aProduct.precio <= options.precioMax;
        }        
        if(typeof options.precioMin !== "undefined" && typeof options.precioMax !== "undefined")           
          aux=aProduct.precio >= options.precioMin && aProduct.precio <= options.precioMax

        return aux;  
    });

    if (options.stockMin)
      query.push((aProduct: Product) => {
      let aux : boolean = false;
      if(typeof options.stockMin !=="undefined" ){
        aux=aProduct.stock >= options.stockMin;
      }        
      if(typeof options.stockMin !== "undefined" && typeof options.stockMax !== "undefined")           
        aux=aProduct.stock >= options.stockMin && aProduct.stock <= options.stockMax

      return aux;  
    });

    if (options.stockMax)
      query.push((aProduct: Product) => {
        let aux : boolean = false;
        if(typeof options.stockMax !=="undefined" ){
          aux=aProduct.stock <= options.stockMax;
        }        
        if(typeof options.stockMin !=="undefined" && typeof options.stockMax !=="undefined")           
          aux=aProduct.stock >= options.stockMin && aProduct.stock <= options.stockMax

        return aux;  
    });

    return this.productos.filter((aProduct) => query.every((x) => x(aProduct)));
  }
}