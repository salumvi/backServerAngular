var express = require('express');
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');
const fileUpload = require('express-fileupload');
const fs =require('fs');


var app = express();
app.use(fileUpload());



app.put('/:tipo/:id', (req, res) => {
    const tipo = req.params.tipo;
    const id = req.params.id;

    let uploadFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            error: 'No se ha enviado archivo archivo'
        });
    }

    uploadFile = req.files.file;
    // comprobamos el tipo de archivo:
    let tipoArchivo = uploadFile.mimetype;

    if (tipoArchivo.indexOf('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de archivo incorrecto',
            error: {},
            tipo: tipoArchivo
        });
    }
    //tambien debemos comprobar que el tipo y el id existen

    const tipos= ['usuarios','hospitales','medicos'];
    if( tipos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'No se encuentra el tipo de archivo',
            error: {permitidos: 'usuarios, hospitales, medicos', tipo: tipo }
        });
    }

    const nameTemp = uploadFile.name.split('.');
    const fileExt = nameTemp[nameTemp.length - 1];
    const milisegundos= new Date().getTime();
    const nombreNuevoArchivo= id +'-'+ milisegundos+ '.' + fileExt;


    uploadPath = './uploads/'+tipo+'/' + nombreNuevoArchivo;

    uploadFile.mv(uploadPath, (err)=>  {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    error: err,
                    path:uploadPath,
                    tipo: tipoArchivo
                });
        }
    });

    guardarImagen(tipo, id, nombreNuevoArchivo, res );

   
});



function  guardarImagen(tipo, id, nombreArchivo, res ){

    if(tipo === 'usuarios'){
        Usuario.findById(id,(err, usuario)=>{
            // hay que validar si el usuarios exxiste, pero lo dejamos para otro día 
            // ya que es un servicio que vamos a consumir nosotros
            if(!usuario){
                return callBackErrObjResppuesta(res, err, 400 , 'No existe el usuario');
            }

            var pathViejo= './uploads/usuarios/'+usuario.img;
            //eliminamos el archivo anterior
            if (fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);              
            }
            //Le asignamos el nuevo
            usuario.img=nombreArchivo;
            usuario.save((err, usuario) =>{
                usuario.password='oculto';
                callBackErrObjResppuesta(res, err,400, 'Error al guardar el archivo', 'usuario',usuario,200);
            });
        });
    }
    if(tipo === 'hospitales'){
        Hospital.findById(id,(err, hospital)=>{
            // hay que validar si el usuarios exxiste, pero lo dejamos para otro día 
            // ya que es un servicio que vamos a consumir nosotros
            if(!hospital){
                callBackErrObjResppuesta(res, err, 400 , 'No existe el Hospital');
                 
            }else {
console.log('object');
            var pathViejo= './uploads/hospitales/'+hospital.img;
            //eliminamos el archivo anterior
            if (fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);              
            }
            //Le asignamos el nuevo
            hospital.img=nombreArchivo;
            hospital.save((err, hospital) =>{
                callBackErrObjResppuesta(res,err, 400,'Error al guardar el archivo', 'hospital', hospital, 200);
            });
        }
        });
    }
    if(tipo === 'medicos'){
        Medico.findById(id,(err, medico)=>{
            // hay que validar si el usuarios exxiste, pero lo dejamos para otro día 
            // ya que es un servicio que vamos a consumir nosotros

            if(!medico){
                return callBackErrObjResppuesta(res, err, 400 , 'No existe el medico');
            }
            var pathViejo= './uploads/medicos/'+medico.img;
        
            //eliminamos el archivo anterior
            if (fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);              
            }
            //Le asignamos el nuevo
            medico.img=nombreArchivo;
            medico.save((err, medico) =>{
                 callBackErrObjResppuesta(res,err, 400,'Error al guardar el archivo', 'medico', medico,200);
            });
        });
    }


}



function callBackErrObjResppuesta(res,err,estatusE,mensaje,tipo,obj,estatusR) {

    if(err){
        return res.status(estatusE)
                .json({
                    ok: false,
                    mensaje: mensaje,
                    error: err
                });
    } else {
        return res.status(estatusR)
                .json({
                    ok: true,
                    [tipo]: obj
                });
    }


}

module.exports = app;