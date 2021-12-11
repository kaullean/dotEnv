import express from 'express'
import path from 'path'
import handlebars from 'express-handlebars'
import miRouter from '../routes/index';
import { ErrorRequestHandler } from 'express';

const app = express();
const publicDir = path.resolve(__dirname, '../../public')
const layoutDir = path.resolve(__dirname, '../../views/layouts')

app.use(express.static(publicDir))

/*  HBS CONFIG  */
app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    layoutsDir:layoutDir,   
    extname:'hbs',
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api', miRouter)

/*Ataja errores*/
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(`HUBO UN ERROR ${err}`);
  res.status(500).json({
    err: err.message,
  });
};
app.use(errorHandler);



export default app;