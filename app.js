
// requires
import { colores } from './colores';
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();

// conexion a la base de datos:

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err, res) => {

    if(err) throw err;
    
    console.log(`Base de datos:  ${ colores.FgGreen }%s${colores.Reset} `, 'online');

})


// rutas:

app.get('/', (req, res, next) => {

    res.status(404).json({
        ok: true,
        mensaje: 'petcion realizada correctamente.'
    });
});







// escuchar peticiones:
app.listen(3000, () =>{

    console.log(`Express corriendo en el puerto 3000 ${ colores.FgGreen }%s${colores.Reset} `, 'online');
})