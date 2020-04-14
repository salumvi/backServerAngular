var express = require('express');
var bcrypt = require('bcryptjs');
import { verificaToken } from "../middelwares/autenticacion";


var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');


//==============================
// busqueda en todo
//==============================

app.get('/:termino', (req, res, next) => {


    // Busqueda mediante Expresion regular
    var exp = RegExp(req.params.termino, 'i');

    var result= {usuarios:[], medicos:[], hospitales:[]};


    Usuario.find({ nombre: { $regex: exp } }, 'nombre email img role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en el Get de usuarios',
                        errors: err
                    });
                }

                result.usuarios = usuarios;
                Medico.find({ nombre: { $regex: exp } })
                    .exec((err, medicos) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error en el Get de medicos',
                                errors: err
                            });
                        }

                        result.medicos = medicos;
                        Hospital.find({nombre: { $regex: exp }})
                                .exec((err,hospitales) =>{
                                   if(err){
                                    return res.status(500).json({
                                        ok: false,
                                        mensaje: 'Error en el Get de medicos',
                                        errors: err
                                    });
                                }
                                result.hospitales=hospitales;
                                res.status(200).json({
                                    ok: true,
                                    expR: exp,
                                    busqueda: result
                                });



                       
                        });

                    });
            });






    //  Hospital.find({nombre:{$regex: exp}})
    //          .exec       


   

});

module.exports = app;
