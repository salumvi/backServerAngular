
//import { statusCodes } from './status.codes';
import { colores } from './config/colores';

// requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

//CORS:
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
  });



// body-PArser:
// este body parser es un midelware (es una funcion que se ejecuta siempre antes de realizar la peticion)
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());




// importar Rutas:
var appRoutes= require('./routes/app');
var uploadRoutes= require('./routes/upload');
var usuarioRoutes= require('./routes/usuario');
var medicoRoutes= require('./routes/medico');
var hospitalRoutes= require('./routes/hospital');
var loginRoutes= require('./routes/login');
var busquedaRoutes= require('./routes/busqueda');
var imagenesRoutes= require('./routes/imagenes');








// conexion a la base de datos:

mongoose.connect('mongodb://localhost:27017/hospitalDB', { 
    useNewUrlParser: true,  
    useCreateIndex: true, 
    useUnifiedTopology: true },
    (err) => {

    if(err) throw err;
    
    console.log(`Base de datos:  ${ colores.FgGreen }%s${colores.Reset} `, 'online');

});
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Rutas:
app.use('/busqueda', busquedaRoutes);
app.use('/img', imagenesRoutes);
app.use('/upload', uploadRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);




// escuchar peticiones:
app.listen(3000, () =>{

    console.log(`Express corriendo en el puerto 3000 ${ colores.FgGreen }%s${colores.Reset} `, 'online');
})