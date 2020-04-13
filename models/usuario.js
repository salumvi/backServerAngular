var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
 
var Schema = mongoose.Schema;

var rolesVAlidos ={
    values : ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role permitido'
};

var usuarioSchema = new Schema({
nombre: {type: String, required: [true, 'El nombre es necesario']},
email: {type: String, unique: [true, 'elija otro emal, este ya está repetido'], required: [true, 'El correo es necesario']},
password: {type: String, required:[true, 'contraseña es obligatoria'] },
img: {type: String, required: false},
role: {type: String, required: true, default: 'USER_ROLE', enum: rolesVAlidos},
});

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser único'});
module.exports = mongoose.model('Usuario', usuarioSchema);