import { ProductosMemDAO } from './DAOs/memory';
import { ProductosSql3DAO } from './DAOs/sqlite3';
import { ProductosFSDAO } from './DAOs/fs';
import { ProductosMYSQL3DAO } from './DAOs/mySQL';
import { ProductosMongoDBDAO } from './DAOs/mongoDB';


export const TipoPersistencia :string ='';

import path from 'path';

export class NoticiasFactoryDAO {
  
  static get(TipoPersistencia : string) {

    switch (TipoPersistencia) {
      case "SQLITE3":
        console.log('Retornando instancia de SQLITE3');
        return new ProductosSql3DAO();

      case "FILESYSTEM":
        console.log('Retornando instancia de FILESYSTEM');
        const filePath = path.resolve(__dirname, './DAOs/persistenciaFS.json');
        return new ProductosFSDAO(filePath);

      case "MYSQL":
        console.log('Retornando instancia de MYSQL');       
        return new ProductosMYSQL3DAO();

      case "MONGODB":
        console.log('Retornando instancia de MONGODB LOCAL');       
        return new ProductosMongoDBDAO(true);

      case "MONGOATLAS":
        console.log('Retornando instancia de MONGOATLAS');       
        return new ProductosMongoDBDAO();  
      default:

        console.log('RETORNANDO INSTANCIA CLASE MEMORIA');
        return new ProductosMemDAO();
    }
  }
}