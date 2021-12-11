import dotenv from 'dotenv';
import path from 'path'
import minimist from 'minimist'


const args = minimist(process.argv);
let {ENV,PORT} = args;

dotenv.config({
  path: path.resolve(__dirname, `../../${ENV}.env`)
})

export default {
  PORT: PORT || 8080,
  MONGO_ATLAS_USER: process.env.MONGO_ATLAS_USER || 'user',
  MONGO_ATLAS_PASSWORD: process.env.MONGO_ATLAS_PASSWORD || 'pasw',
  MONGO_ATLAS_CLUSTER: process.env.MONGO_ATLAS_CLUSTER || 'clusterUrl',
  MONGO_ATLAS_DBNAME: process.env.MONGO_ATLAS_DBNAME || 'dbName',
  MONGO_LOCAL_DBNAME: process.env.MONGO_LOCAL_DBNAME || 'dbNameLocal',
  PERSISTENCIA:process.env.PERSISTENCIA || "FILESYSTEM",
};