var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
import { SEED } from "../config/config";

var app = express();

var Usuario = require('../models/usuario');



app.post('/', (req, res) => {

    var body = req.body;
    // priemro verifico si el email existe


    //body.password =bcrypt.h (body.password, 10),

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuarioDB) {
            return res.status(201).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: { message: 'El email: ' + body.email + ' no está registrado' },

            });
        }
        //Comparamos las claves
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(201).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: { message: 'El pass: ' + body.password + ' no está registrado' }
            });

        }

        // si llega hasta aquí se ha autenticado correctamente.
        usuarioDB.password = 'oculta';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas 


        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            id: usuarioDB._id,
            token: token
        });
    });

})

















module.exports = app;