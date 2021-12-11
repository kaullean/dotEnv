import knex from 'knex';
import {
    newProduct,
    Product,
    ProductBaseClass,
    ProductQuery,
  } from '../products.interface';
  
  export const mySQLDB = knex({
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'mySQLPersistencia',
    },
    pool: { min: 0, max: 7 },
  });


/*Faltaria definir mas especificamente los campos de la tabla*/
export class ProductosMYSQL3DAO implements ProductBaseClass {
    private productos: Product[] = [];
    private ID: string='0';

    constructor(){
       this.inicializarDB();

    }
    async inicializarDB(){
      
        await mySQLDB.schema.hasTable('productos').then((exists) => {
            if (!exists) {
              console.log('NO EXISTE LA TABLA PRODUCTOS. VAMOS A CREARLA');
              mySQLDB.schema
                .createTable('productos', (table) => {
                    table.string('_id').notNullable();
                    table.timestamp('timestamp').defaultTo(mySQLDB.fn.now())
                    table.string('nombre').notNullable();
                    table.string('descripcion').notNullable();
                    table.string('codigo').notNullable();
                    table.string('fotoUrl').notNullable();
                    table.integer('precio').notNullable();
                    table.integer('stock').notNullable();
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

        mockData.forEach(async(aMock) => await mySQLDB('productos').insert(aMock));

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
        return await mySQLDB.from('productos').where({ _id : id}).select();
      }
      return await mySQLDB.from('productos').select();
    }
  
    async add(data: newProduct): Promise<Product> {
      const newItem: Product = {
        _id: this.proximoID(),
        timestamp: new Date(),
        ...data
      };
      
       await mySQLDB('productos').insert(newItem);
  
       return newItem;
    }
  
    async update(id: string, newProductData: newProduct): Promise<Product> {
    
       await mySQLDB.from('productos').where({ _id : id }).update(newProductData);
       const updatedProduct=await mySQLDB.from('productos').where({ _id : id }).select();
       const aux=updatedProduct[0] 
       return aux;
    }
  
    async delete(id: string): Promise<Product> {

        const deletedItem=await mySQLDB.from('productos').where({ _id : id}).select();
        const aux=deletedItem[0]  
        await mySQLDB.from('productos').where({ _id : id }).del()
        return aux;
      
    }
  
    async query(options: ProductQuery): Promise<Product[]> {
        const busqueda=await mySQLDB.from('productos')
        .where({nombre:options.nombre, codigo:options.codigo}).select();

        return busqueda;
     }
  }

  