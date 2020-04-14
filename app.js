
//import { statusCodes } from './status.codes';
import { colores } from './config/colores';

// requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();



// body-PArser:
// este body parser es un midelware (es una funcion que se ejecuta siempre antes de realizar la peticion)
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());




// importar Rutas:
var appRoutes= require('./routes/app');
var usuarioRoutes= require('./routes/usuario');
var medicoRoutes= require('./routes/medico');
var hospitalRoutes= require('./routes/hospital');
var loginRoutes= require('./routes/login');
var busquedaRoutes= require('./routes/busqueda');







// conexion a la base de datos:

mongoose.connect('mongodb://localhost:27017/hospitalDB', { 
    useNewUrlParser: true,  
    useCreateIndex: true, 
    useUnifiedTopology: true },
    (err) => {

    if(err) throw err;
    
    console.log(`Base de datos:  ${ colores.FgGreen }%s${colores.Reset} `, 'online');

});


// Rutas:
app.use('/busqueda', busquedaRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);







// escuchar peticiones:
app.listen(3000, () =>{

    console.log(`Express corriendo en el puerto 3000 ${ colores.FgGreen }%s${colores.Reset} `, 'online');
})