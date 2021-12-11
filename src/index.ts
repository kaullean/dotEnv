import app from './services/server'

const puerto = process.env.PORT || 8080;

const server = app.listen(puerto,()=>{
    console.log("SERVER UP EN PUERTO "+puerto);
    
})
server.on('error',(err : Error)=>{
    console.log("Error",err);
});

