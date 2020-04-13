var jwt = require('jsonwebtoken');
import { SEED } from "../config/config";

//==============================
// Verificar Token, a partir de aqui todas las operaciones necesitan autenticación
//==============================

export const verificaToken = function(req, res, next) {

    var token = req.query.token;
    jwt.verify(token,SEED,(err, decoder)=>{
        // si hay error no salimos porque el token no es valido
        if(err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token No valido',
                errors: err
            });
        }

        req.usuario=decoder.usuario;

        // res.status(200).json({
        //     ok: true,
        //     decoder:decoder
        // });
        // para que pueda continuar
        next();
    });

}
