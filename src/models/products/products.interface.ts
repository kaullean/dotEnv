export interface newProduct{
    nombre: string;
    descripcion: string;
    codigo: string;
    fotoUrl: string;
    precio: number;
    stock: number;
  }
  
  export interface Product {
    _id: string;
    timestamp: Date;
    nombre: string;
    descripcion: string;
    codigo: string;
    fotoUrl: string;
    precio: number;
    stock: number;
  }
  
  export interface ProductQuery {

    nombre?: string;
    codigo?:string;
    precioMin?: number;
    precioMax?: number;
    stockMin?: number;
    stockMax?: number;
  }
  
  export interface ProductBaseClass {
    get(id?: string | undefined): Promise<Product[]>;
    add(data: newProduct): Promise<Product>;
    update(id: string, newProductData: newProduct): Promise<Product>;
    delete(id: string): Promise<Product>;
    query(options: ProductQuery): Promise<Product[]>;
  }