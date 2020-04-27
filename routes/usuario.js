var express = require('express');
var bcrypt = require('bcryptjs');
import {verificaToken, verificaADMIN_ROLE}  from "../middelwares/autenticacion";


var app = express();

var Usuario = require('../models/usuario')

//==============================
// Obtener usuarios
//==============================

app.get('/', (req, res, next) => {

    // ojo con lo que viene por este query puede no ser un Number
    var desde = req.query.desde || 0;
    desde = Number(desde);


    Usuario.find({}, 'nombre email img role googleuser')
    .skip(desde)
    .limit(5)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en el Get de usuarios',
                        errors: err
                    });
                }
                Usuario.countDocuments({},(err,count) =>{
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: count
                    });

                });


            });

});





//==============================
// Actualizar un usuario
//==============================
app.put('/:id',[verificaToken,verificaADMIN_ROLE], (req, res) => {
    var id = req.params.id;
    var body = req.body;

    // comprobamos si existe el usuario y si hay errores:
    Usuario.findById(id, (err, usuario) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if(!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id: '+ id + ' no existe',
                errors: {message: 'No existe un usuario con ese id'}
            });

        }
        // ya existe un usuario

        usuario.nombre=body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            } 
            usuarioGuardado.password= 'oculto';    
            res.status(201).json({
                ok: true,
                usuario: usuarioGuardado
             });
        });
    });
  
});





//==============================
// Crear un nuevo usuario
//==============================
app.post('/', (req, res) => {

    console.log(req.body);
    // este body se obtiene por el body-parser
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });


    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el usuario',
                errors: err
            });
        }
        usuarioGuardado.password = 'oculto';
         res.status(201).json({
            ok: true,
             usuarioNew: usuarioGuardado,
             usuarioPeticion: req.usuario

        });
    });
});


//==============================
// Borrar un nuevo usuario
//==============================
app.delete('/:id',[verificaToken, verificaADMIN_ROLE],(req, res) => {
    var id = req.params.id;
    Usuario.findOneAndDelete({_id: id}, (err, usuarioBorrado) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el usuario',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con id: '+ id +' no existe',
                errors: {message: 'El usuario no existe'}
            });
        }
         res.status(200).json({
            ok: true,
             usuario: usuarioBorrado
        });
    });

});



module.exports = app;
