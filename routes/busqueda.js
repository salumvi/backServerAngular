var express = require('express');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');



//==============================
// busqueda por coleccion
//==============================
app.get('/coleccion/:tabla/:termino',(req,res) =>{
    
    // Busqueda mediante Expresion regular
    var termino = req.params.termino;
    var tabla = req.params.tabla;
    var regexp = new RegExp(termino, 'i');

    var promesa;

    
    switch (tabla) {
        case 'usuarios':
            promesa= buscarUsuarios(regexp);
          
            break;
        case 'medicos':
            promesa=buscarMedicos(regexp);
           
            break;
        case 'hospitales':
            promesa=buscarHospitales(regexp);
            
            break; 
            default:
                return res.status(400).json({
                    ok:false,
                    error: 'Ruta no vlaida'
                });            
    } 

    promesa
    .then(respuesta=>{
        return res.status(200)
        .json({
            ok: true,
            [tabla]: respuesta
        });
    }).catch(err => {
        res.status(400).json({
            ok: false,
            error: err
        });
     });   
});

//==============================
// busqueda General
//==============================

app.get('/:termino', (req, res, next) => {


    // Busqueda mediante Expresion regular
    var termino = req.params.termino;
    var regexp = new RegExp(termino, 'i');

    Promise.all([
        buscarUsuarios(regexp),
        buscarMedicos(regexp),
        buscarHospitales(regexp)
    ]).then(respuestas =>{

        res.status(200)
            .json({
                ok: true,
                usuarios:respuestas[0],
                medicos:respuestas[1],
                hospitales: respuestas[2]

            });
    }).catch(err =>{
        res.status(400).json({
            ok: false,
            error: err
        });
    })
    
    
    //var result= {usuarios:[], medicos:[], hospitales:[]};


    // Usuario.find({ nombre: exp }, 'nombre email img role')
    //     .exec(
    //         (err, usuarios) => {
    //             if (err) {
    //                 return res.status(500).json({
    //                     ok: false,
    //                     mensaje: 'Error en el Get de usuarios',
    //                     errors: err
    //                 });
    //             }

    //             result.usuarios = usuarios;
    //             Medico.find({ nombre: { $regex: exp } })
    //                 .populate('hospital', 'nombre')
    //                 .populate('usuario', 'nombre email role')
    //                 .exec((err, medicos) => {
    //                     if (err) {
    //                         return res.status(500).json({
    //                             ok: false,
    //                             mensaje: 'Error en el Get de medicos',
    //                             errors: err
    //                         });
    //                     }

    //                     result.medicos = medicos;
    //                     Hospital.find({nombre: { $regex: exp }})
    //                             .populate('usuario', 'nombre email role')
    //                             .exec((err,hospitales) =>{
    //                                if(err){
    //                                 return res.status(500).json({
    //                                     ok: false,
    //                                     mensaje: 'Error en el Get de medicos',
    //                                     errors: err
    //                                 });
    //                             }
    //                             result.hospitales=hospitales;
    //                             res.status(200).json({
    //                                 ok: true,
    //                                 expR: exp,
    //                                 busqueda: result
    //                             });



                       
    //                     });

    //                 });
    //         });


});


function buscarUsuarios(regexp){
    
    return new Promise((resolve, rejet)=>{
        Usuario.find({},'nombre email img role')
        .or({nombre: regexp}, {email: regexp})
        .exec((err, usuarios) =>{
            if(err){
                rejet('Error en la recepcion de usuarios', err);
            }else{
                resolve(usuarios);
            }
        });

    });
}

function buscarMedicos(regexp){
    
    return new Promise((resolve, rejet)=>{
        Medico.find({nombre: regexp})
        .populate('usuario','nombre email')
        .populate('hospital')
        .exec((err, medicos) =>{
            if(err){
                rejet('Error en la recepcion de medicos', err);
            }else{
                resolve(medicos);
            }
        });

    });

}

function buscarHospitales(regexp){
    
    return new Promise((resolve, rejet)=>{
        Hospital.find({nombre: regexp})
        .populate('usuario','nombre email')
        .exec((err, hospitales) =>{
            if(err){
                rejet('Error en la recepcion de hospitales', err);
            }else{
                resolve(hospitales);
            }
        });

    });

}



module.exports = app;
