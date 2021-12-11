import {
  newProduct,
  Product,
  ProductBaseClass,
  ProductQuery,
} from '../products.interface';
import mongoose from 'mongoose';

import Config from '../../../config'

const productsSchema = new mongoose.Schema<Product>({
  _id: String,
  timestamp: Date,
  nombre: String,
  descripcion: String,
  codigo: String,
  fotoUrl: String,
  precio: Number,
  stock: Number,
});

export class ProductosMongoDBDAO implements ProductBaseClass {
    
    private srv: string;
    private productos;
    private ID = '0'
    constructor(local: boolean = false) {
        if (local)
            this.srv = `mongodb://localhost:27017/${Config.MONGO_LOCAL_DBNAME}`;
        else
            this.srv = `mongodb+srv://${Config.MONGO_ATLAS_USER}:${Config.MONGO_ATLAS_PASSWORD}@${Config.MONGO_ATLAS_CLUSTER}/${Config.MONGO_ATLAS_DBNAME}?retryWrites=true&w=majority`;
        console.log(this.srv);
        
            mongoose.connect(this.srv);
        this.productos = mongoose.model<Product>('producto', productsSchema);
        this.inicializarDB();
    }

    async inicializarDB(){
        const flag=await this.productos.find();
        
        if(!flag.length){
            const mockData = [
            { _id: this.proximoID(), timestamp:new Date(), nombre: 'lapiz', descripcion:'Lapiz HB negro', codigo: "codigoLapiz", fotoUrl: "url/lapiz", precio: 100,stock:10},
            { _id: this.proximoID(), timestamp:new Date(), nombre: 'goma', descripcion:'goma blanca', codigo: "codigoGoma", fotoUrl: "url/goma", precio: 200,stock:20},
            { _id: this.proximoID(), timestamp:new Date(), nombre: 'calculadora', descripcion:'calculadora cientifica', codigo: "codigoCalculadora", fotoUrl: "url/calculadora", precio: 300,stock:30},
            { _id: this.proximoID(), timestamp:new Date(), nombre: 'escuadra', descripcion:'escuadra 45 grados', codigo: "codigoEscuadra", fotoUrl: "url/escuadra", precio: 400,stock:40},
            { _id: this.proximoID(), timestamp:new Date(), nombre: 'regla', descripcion:'regla 20cm transparente', codigo: "codigoRegla", fotoUrl: "url/regla", precio: 500,stock:50},
            ];
            mockData.forEach(async(aMock) => await new this.productos(aMock).save());
        }   
    }

    proximoID(){ 
        const proximoId=Number(this.ID)+1
        this.ID=proximoId.toString();
        return this.ID;
    }

    async get(id?: string): Promise<Product[]> {
        let output: Product[] = [];
            if (id) {
                const document = await this.productos.findById(id);
            if (document) output.push(document);
            } else {
                output = await this.productos.find();
            }
            return output;
        
    }

    async add(data: newProduct): Promise<Product> {
        const newProduct = new this.productos(data);
        let flag=await this.get(this.proximoID())
        while(flag.length){
            flag=await this.get(this.proximoID())
        }//increible pero este while rellena los id que no existan y si existen todos sigue de forma incremental
     
        newProduct._id=this.ID;
        newProduct.timestamp=new Date();
        await newProduct.save();
        return newProduct;
    }

    async update(id: string, newProductData: newProduct): Promise<Product> {
        return this.productos.findByIdAndUpdate(id, newProductData);
    }

    async delete(id: string): Promise<Product> {
        let deletedItem=await this.get(id)
        let aux=deletedItem[0] 
        await this.productos.findByIdAndDelete(id);
        return aux;
    }

    // async query(options: ProductQuery): Promise<Product[]> {
    //     const query: ProductQuery ={};

    // if (options.nombre) query.nombre = options.nombre;

    // if (options.precioMax) query.precioMax = options.precioMax;
    // if (options.precioMin) query.precioMin = options.precioMin;
    // if (options.stockMin) query.stockMin = options.stockMin;
    // if (options.stockMax) query.stockMax = options.stockMax;
    // if (options.codigo) query.codigo = options.codigo;
    
    //     console.log(query);
        
    // return this.productos.find(query);
    // }
    async query(options: ProductQuery): Promise<Product[]> {

        type Conditions = (aProduct: Product) => boolean;
        const query: Conditions[] = [];
        const productos : Product[] =await this.get();
  
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
      return productos.filter((aProduct) => query.every((x) => x(aProduct)));
    }
}

