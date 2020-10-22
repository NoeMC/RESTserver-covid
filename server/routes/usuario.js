const express = require('express');
const _ = require('underscore');
const modelos = require('../models/usuario');
var axios = require('axios');


const Historial = modelos.historial
const Estados = modelos.estado
const Ciudades = modelos.ciudad

const app = express();

app.get('/citiesAround', (req, res) => {
    let key = req.query.key;
    let lat = req.query.lat;
    let lng = req.query.lng;
    let nmax = req.query.nmax;

    if (key === undefined || lat === undefined || lng === undefined) {
        return res.status(400).json({
            ok: false,
            err: 'parametros incompletos'
        });

    }

    var config = {
        method: 'get',
        url: `https://api.geodatasource.com/cities?key=${key}&lat=${lat}&lng=${lng}`,
        headers: {},
    };

    axios(config)
        .then(function(response) {
            let datos = response.data.slice(0, nmax);
            res.json({
                data: datos
            });
        })
        .catch(function(error) {
            res.status(400).json({
                ok: false,
                error
            });
        });
});


app.get('/estados', (req, res) => {

    Estados.find((null), (err, estado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            estados: estado
        });
    });

});

app.get('/estado', (req, res) => {
    let nombre = req.query.nombre;
    Estados.find({ nombre: nombre }, (err, state) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            state
        });

    });

});

app.get('/ciudad', (req, res) => {
    let nombre = req.query.nombre;
    Ciudades.find({ nombre: nombre }, (err, city) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            city
        });

    });

});

app.get('/desarrollo', (req, res) => {
    res.json({
        ok: true,
        estados: "si funciona el servidor"
    });

});

app.post('/estado', function(req, res) {

    let body = req.body;

    let Edos = new Estados({
        nombre: body.nombre
    });

    Edos.save((err, estado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            estados: estado
        });


    });


});

app.post('/ciudad', function(req, res) {
        let body = req.body;

        let city = new Ciudades({
            nombre: body.nombre,
            latitud: body.lat,
            longitud: body.lng
        });

        city.save((err, ciudad) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                ciudad
            });
        });



    }

);

app.put('/historialCity', function(req, res) {
    let bandera = null;
    let body = req.body;
    let DiaActual = null;
    let history = null;

    if (body.date === undefined) {
        DiaActual = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        history = new Historial({
            fecha: DiaActual,
            activos: body.activos,
            muertes: body.muertes,
            nuevosCasos: body.nuevoscasos,
            muertesAcumulado: body.muertesacu,
            acumulados: body.acumulados
        });
    } else {
        DiaActual = new Date(body.date);
        history = new Historial({
            fecha: DiaActual,
            activos: body.activos,
            muertes: body.muertes,
            nuevosCasos: body.nuevoscasos,
            muertesAcumulado: body.muertesacu,
            acumulados: body.acumulados
        });

    }

    Ciudades.findOneAndUpdate({ nombre: body.nombre, "historial.fecha": DiaActual }, { $set: { "historial.$": history } }, { new: true }, (err, user) => {
        bandera = user;

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            status: user
        });
    }).then(() => {
        if (bandera === null) {

            Ciudades.findOneAndUpdate({ nombre: body.nombre }, { $addToSet: { historial: history } }, { safe: true, new: true }, () => {

            });

        }
    });
});

app.put('/historialEstado', function(req, res) {
    let bandera = null;
    let body = req.body;
    let DiaActual = null;
    let history = null;

    if (body.date === undefined) {
        DiaActual = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        history = new Historial({
            fecha: DiaActual,
            activos: body.activos,
            muertes: body.muertes,
            nuevosCasos: body.nuevoscasos,
            muertesAcumulado: body.muertesacu,
            acumulados: body.acumulados
        });
    } else {
        DiaActual = new Date(body.date);
        history = new Historial({
            fecha: DiaActual,
            activos: body.activos,
            muertes: body.muertes,
            nuevosCasos: body.nuevoscasos,
            muertesAcumulado: body.muertesacu,
            acumulados: body.acumulados
        });

    }

    Estados.findOneAndUpdate({ nombre: body.nombre, "historial.fecha": DiaActual }, { $set: { "historial.$": history } }, { new: true }, (err, user) => {
        bandera = user;

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            status: user
        });
    }).then(() => {
        if (bandera === null) {

            Estados.findOneAndUpdate({ nombre: body.nombre }, { $addToSet: { historial: history } }, { safe: true, new: true }, () => {

            });

        }
    });
});


module.exports = app;