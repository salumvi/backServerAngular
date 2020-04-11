
// requires
var express = require('express');
import { colores } from './colores';

// Inicializar variables
var app = express();


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