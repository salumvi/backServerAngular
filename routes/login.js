var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

import { SEED, CLIENT_ID } from "../config/config";

var app = express();

var Usuario = require('../models/usuario');


async function verify(token) {
    const client = new OAuth2Client(CLIENT_ID);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        name: payload.name,
        email: payload.email,
        isGoogle: true,
        picture: payload.picture
    };
}

//========================
// Login de google
//========================
app.post('/google', async (req, res) => {
    const token = req.body.idtoken;

    var googleUser = await verify(token).then()
        .catch((e) => {
            return res.status(403)
                .json({
                    ok: false,
                    mensaje: "token no valido.",
                    errors: e
                });
        });

    // no se porque pero cuando el token no es valido la ejecución continúa 
    //
    if (googleUser.email === undefined) {
        return false;
    }
    // El usuario se ha autenticado con google
    // tengo que comprobar si esta en nuestra BASE de datos

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    errors: err,
                    mensaje: 'Error al buscar el usuario'
                });
        }

        // si el usuario existe es como si se estuviera autenticando otra vez
        // le tengo que generar otro token de nuevo
        if (usuarioDB) {

            //comprobamos si se autenticó por google para darle otro token
            // si no se autentico por google se lo decimos para que lo haga.
            // tambien podíamos utulizar esa info para autenticarle directamente
            // pero para eso deberíamo asegurarnos que ese correo es suyo
            if (!usuarioDB.googleuser) {
                return res.status(400)
                    .json({
                        ok: false,
                        mensaje: 'debe utilizar su autenticacion normal'
                    });
            } else {
                // le generamos un token nuevo
                usuarioDB.password = 'oculta';
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas 

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    id: usuarioDB._id,
                    token: token
                });
            }

        } else {

            // el usuario no existe hay que crearlo
            const usuario = new Usuario({
                nombre: googleUser.name,
                email: googleUser.email,
                img: googleUser.picture,
                password: "no necesita",
                googleuser: true
            });

            usuario.save((err, usuarioDB) => {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas 
                if (err) {
                    return res.status(400)
                        .json({
                            ok: false,
                            errors: err,
                            mensaje: "error al guardar el usuario de cuenta de google"
                        });
                }
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    id: usuarioDB._id,
                    token: token
                });
            });
        }

    });


});



//========================
// Login normal
//========================
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

});

















module.exports = app;