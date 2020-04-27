var express = require('express');
var bcrypt = require('bcryptjs');
import {verificaToken}  from "../middelwares/autenticacion";


var app = express();

var Medico = require('../models/medico');

//==============================
// Obtener Medicos
//==============================

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find()
    .skip(desde)
    //.limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .exec((err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en el Get de medicos',
                        errors: err
                    });
                }
                Medico.countDocuments({},(err, cont) =>{

                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: cont
                    });
                });


            });

});





//==============================
// Actualizar un medico 
//==============================
app.put('/:id', verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    // comprobamos si existe el medico y si hay errores:
    Medico.findById(id, (err, medico) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }
        if(!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id: '+ id + ' no existe',
                errors: {message: 'No existe un medico con ese id'}
            });

        }
        // ya existe un medico

        medico.nombre=body.nombre;
        medico.hospital = body.hospital;
        medico.usuario = req.usuario._id;

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            } 
            medicoGuardado.password= 'oculto';    
            res.status(201).json({
                ok: true,
                medico: medicoGuardado,
                usuarioPeticion: req.usuario
             });
        });
    });
  
});





//==============================
// Crear un nuevo medico
//==============================
app.post('/', verificaToken, (req, res) => {

    // este body se obtiene por el body-parser
    // de aquí tambien extraemos los datos del usuario que está creando el medico
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital,
        img: body.img,
       
    });


    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el medico',
                errors: err
            });
        }
         res.status(201).json({
            ok: true,
             medicoNew: medicoGuardado,
             usuarioPeticion: req.usuario

        });
    });
});


//==============================
// Borrar un nuevo medico
//==============================
app.delete('/:id', verificaToken, (req, res) => {
    var id = req.params.id;
    Medico.findOneAndDelete({_id: id}, (err, medicoBorrado) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el medico',
                errors: err
            });
        }
        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con id: '+ id +' no existe',
                errors: {message: 'El medico no existe'}
            });
        }
         res.status(200).json({
            ok: true,
             medico: medicoBorrado,
             usuarioPeticion: req.usuario
        });
    });

});

/**
 * GetById: buscar Medico por Id de medico.
 * ruta: /medico/:id
 */
app.get('/:id',(req, res) =>{
    var id = req.params.id;
    Medico.findById(id)
          .populate('hospital')
          .exec((err, medico) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error en Baqse de datos medico',
                errors: err
            });

        }
        if(!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El médico no existe',
                errors: err
            });
        }


        return res.status(200).json({
            ok: true,
             medico: medico
        });

    });


});


module.exports = app;
