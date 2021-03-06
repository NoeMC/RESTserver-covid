const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const unique = require('underscore');

let Schema = mongoose.Schema;

let historialSchema = new Schema({
    fecha: {
        type: Date
    },
    acumulados: {
        type: Number,
        required: false,
        default: 0

    },
    muertesAcumulado: {
        type: Number,
        required: false,
        default: 0

    },
    activos: {
        type: Number,
        required: false,
        default: 0
    },
    muertes: {
        type: Number,
        required: false,
        default: 0
    },
    nuevosCasos: {
        type: Number,
        required: false,
        default: 0
    }
});


let CiudadSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la ciudad es requerido']

    },
    latitud: {
        type: Number,
        required: [true, 'Latitud es obligatoria']

    },
    longitud: {
        type: Number,
        required: [true, 'longitud es obligatoria']

    },
    historial: [historialSchema]
});


let estadoSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre del Estado es requerido']

    },
    historial: [historialSchema]
});

estadoSchema.pre('save', function(next) {
    this.ciudades = unique.uniq(this.ciudades);
    next();
});


estadoSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


estadoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });


exports.estado = mongoose.model('Estado', estadoSchema);
exports.ciudad = mongoose.model('Ciudad', CiudadSchema);
exports.historial = mongoose.model('Historial', historialSchema);