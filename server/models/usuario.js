const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const unique = require('underscore');

let Schema = mongoose.Schema;

let historialSchema = new Schema({
    fecha: {
        type: Date
    },
    activos: {
        type: Number
    },
    muertes: {
        type: Number
    }
});


let CiudadSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la ciudad es requerido']

    },
    latitud: {
        type: String,
        required: [true, 'Latitud es obligatoria']

    },
    longitud: {
        type: String,
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
    casosActivos: {
        type: Number,
        required: false,
        default: 0

    },
    muertes: {
        type: Number,
        required: false,
        default: 0
    }
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