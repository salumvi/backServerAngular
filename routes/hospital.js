var express = require('express');
var bcrypt = require('bcryptjs');
import {verificaToken}  from "../middelwares/autenticacion";


var app = express();

var Hospital = require('../models/hospital')

//==============================
// Obtener Hospitales
//==============================

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .exec((err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en el Get de hospitales',
                        errors: err
                    });
                }
                Hospital.count({}, (err, count) => {
                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: count
                    });

                });


            });

});





//==============================
// Actualizar un hospital  verificaToken
//==============================
app.put('/:id',verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    // comprobamos si existe el hospital y si hay errores:
    Hospital.findById(id, (err, hospital) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }
        if(!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id: '+ id + ' no existe',
                errors: {message: 'No existe un hospital con ese id'}
            });

        }
        // ya existe un hospital

        hospital.nombre=body.nombre;
        hospital.hospital = body.hospital;

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            } 
            hospitalGuardado.password= 'oculto';    
            res.status(201).json({
                ok: true,
                hospital: hospitalGuardado,
                usuariopeticion: req.usuario
             });
        });
    });
  
});





//==============================
// Crear un nuevo hospital
//==============================
app.post('/', verificaToken, (req, res) => {

    // este body se obtiene por el body-parser
    // de aquí tambien extraemos los datos del usuario que está creando el hospital
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id,
        img: body.img
    });


    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el hospital',
                errors: err
            });
        }
         res.status(201).json({
            ok: true,
             hospitalNew: hospitalGuardado,
             uaurioPeticion: req.usuario

        });
    });
});


//==============================
// Borrar un nuevo hospital
//==============================
app.delete('/:id',verificaToken ,(req, res) => {
    var id = req.params.id;
    Hospital.findOneAndDelete({_id: id}, (err, hospitalBorrado) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el hospital',
                errors: err
            });
        }
        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con id: '+ id +' no existe',
                errors: {message: 'El hospital no existe'}
            });
        }
         res.status(200).json({
            ok: true,
             hospital: hospitalBorrado,
             usuariopeticion: req.usuario
        });
    });

});



module.exports = app;
