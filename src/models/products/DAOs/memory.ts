import {
    newProduct,
    Product,
    ProductBaseClass,
    ProductQuery,
  } from '../products.interface';
  
export class ProductosMemDAO implements ProductBaseClass {
  private productos: Product[] = [];
  private ID: string='0';

  constructor(){
    
    // const mockData = [
    //   { _id: this.proximoID(), timestamp:new Date(), nombre: 'lapiz', descripcion:'Lapiz HB negro', codigo: "codigoLapiz", fotoUrl: "url/lapiz", precio: 100,stock:10},
    //   { _id: this.proximoID(), timestamp:new Date(), nombre: 'goma', descripcion:'goma blanca', codigo: "codigoGoma", fotoUrl: "url/goma", precio: 200,stock:20},
    //   { _id: this.proximoID(), timestamp:new Date(), nombre: 'calculadora', descripcion:'calculadora cientifica', codigo: "codigoCalculadora", fotoUrl: "url/calculadora", precio: 300,stock:30},
    //   { _id: this.proximoID(), timestamp:new Date(), nombre: 'escuadra', descripcion:'escuadra 45 grados', codigo: "codigoEscuadra", fotoUrl: "url/escuadra", precio: 400,stock:40},
    //   { _id: this.proximoID(), timestamp:new Date(), nombre: 'regla', descripcion:'regla 20cm transparente', codigo: "codigoRegla", fotoUrl: "url/regla", precio: 500,stock:50},
    //   { _id: this.proximoID(), timestamp:new Date(), nombre: 'lapiz1', descripcion:'Lapiz HB negro', codigo: "codigoLapiz", fotoUrl: "url/lapiz", precio: 10,stock:10},
      
    // ];
    // mockData.forEach((aMock) => this.productos.push(aMock));
  }

  proximoID(){

    const proximoId=Number(this.ID)+1
    this.ID=proximoId.toString();
    return this.ID;
  }
  
  findIndex(id: string) {
    return this.productos.findIndex((aProduct) => aProduct._id == id);
  }

  find(id: string): Product | undefined {
    return this.productos.find((aProduct) => aProduct._id === id);
  }

  async get(id?: string): Promise<Product[]> {
    if (id) {
      return this.productos.filter((aProduct) => aProduct._id === id);
    }
    return this.productos;
  }

  async add(data: newProduct): Promise<Product> {
    const newItem: Product = {
      _id: this.proximoID(),
      timestamp: new Date(),
      ...data
    };
    
    this.productos.push(newItem);

    return newItem;
  }

  async update(id: string, newProductData: newProduct): Promise<Product> {
    const index = this.findIndex(id);
    const oldProduct = this.productos[index];

    const updatedProduct: Product = { ...oldProduct, ...newProductData };
    this.productos.splice(index, 1, updatedProduct);
    return updatedProduct;
  }

  async delete(id: string): Promise<Product> {
    const index = this.findIndex(id);
    const productoBorrado=this.productos[index]    
    this.productos.splice(index, 1);
    return productoBorrado;
    
  }

  async query(options: ProductQuery): Promise<Product[]> {

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