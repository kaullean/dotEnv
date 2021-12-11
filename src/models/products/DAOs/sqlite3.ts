import knex from 'knex';
import {
    newProduct,
    Product,
    ProductBaseClass,
    ProductQuery,
  } from '../products.interface';
  
export const sqliteDB = knex({
  client: 'sqlite3',
  connection: { filename: './midbligera.sqlite' },
  useNullAsDefault: true,
});


/*Faltaria definir mas especificamente los campos de la tabla*/
export class ProductosSql3DAO implements ProductBaseClass {
    private productos: Product[] = [];
    private ID: string='0';

    constructor(){
       this.inicializarDB();

    }
    async inicializarDB(){
        await sqliteDB.schema.hasTable('productos').then((exists) => {
            if (!exists) {
                console.log('NO EXISTE LA TABLA Productos. VAMOS A CREARLA');
                sqliteDB.schema
                .createTable('productos', (table) => {
                    table.string('_id')
                    table.timestamp('timestamp').defaultTo(new Date())
                    table.string('nombre')
                    table.string('descripcion')
                    table.string('codigo')
                    table.integer('fotoUrl')
                    table.integer('precio')
                    table.integer('stock')
            
                })
                .then(() => {
                    console.log('DONE');
                });
            }
        });
          
        const mockData = [
            { _id: this.proximoID(), timestamp:new Date(), nombre: 'lapiz', descripcion:'Lapiz HB negro', codigo: "codigoLapiz", fotoUrl: "url/lapiz", precio: 100,stock:10},
            { _id: this.proximoID(), timestamp:new Date(), nombre: 'goma', descripcion:'goma blanca', codigo: "codigoGoma", fotoUrl: "url/goma", precio: 200,stock:20},
            { _id: this.proximoID(), timestamp:new Date(), nombre: 'calculadora', descripcion:'calculadora cientifica', codigo: "codigoCalculadora", fotoUrl: "url/calculadora", precio: 300,stock:30},
            { _id: this.proximoID(), timestamp:new Date(), nombre: 'escuadra', descripcion:'escuadra 45 grados', codigo: "codigoEscuadra", fotoUrl: "url/escuadra", precio: 400,stock:40},
            { _id: this.proximoID(), timestamp:new Date(), nombre: 'regla', descripcion:'regla 20cm transparente', codigo: "codigoRegla", fotoUrl: "url/regla", precio: 500,stock:50},
        ];

        mockData.forEach(async(aMock) => await sqliteDB('productos').insert(aMock));

    }
    proximoID(){ 
      const proximoId=Number(this.ID)+1
      this.ID=proximoId.toString();
      return this.ID;
    }
    
  
    find(id: string): Product | undefined {
       return this.productos.find((aProduct) => aProduct._id === id);
    }
  
    async get(id?: string): Promise<Product[]> {
      if (id) {
        return await sqliteDB.from('productos').where({ _id : id}).select();
      }
      return await sqliteDB.from('productos').select();
    }
  
    async add(data: newProduct): Promise<Product> {
      const newItem: Product = {
        _id: this.proximoID(),
        timestamp: new Date(),
        ...data
      };
      
       await sqliteDB('productos').insert(newItem);
  
       return newItem;
    }
  
    async update(id: string, newProductData: newProduct): Promise<Product> {
    
       await sqliteDB.from('productos').where({ _id : id }).update(newProductData);
       const updatedProduct=await sqliteDB.from('productos').where({ _id : id }).select();
       const aux=updatedProduct[0]//Horrible, pero la unica forma de parsear lo que me devuelve la base de datos para que sea un solo objeto    
       return aux;
    }
  
    async delete(id: string): Promise<Product> {

        const deletedItem=await sqliteDB.from('productos').where({ _id : id}).select();
        const aux=deletedItem[0]  
        sqliteDB.from('productos').where({ _id : id }).del()
        return aux;
      
    }
  
    async query(options: ProductQuery): Promise<Product[]> {
        const busqueda=await sqliteDB.from('productos').where({nombre:options.nombre,codigo:options.codigo}).select();
        return busqueda;
     }
  }

  