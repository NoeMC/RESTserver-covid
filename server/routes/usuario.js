const express = require('express');
const _ = require('underscore');
const modelos = require('../models/usuario');


const Historial = modelos.historial
const Estados = modelos.estado
const Ciudades = modelos.ciudad

const app = express();


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

app.get('/ciudad', (req, res) => {
    let body = req.body;
    Ciudades.find({ nombre: body.nombre }, (err, city) => {
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

app.post('/estado', function(req, res) {

    let body = req.body;

    let Edos = new Estados({
        nombre: body.nombre,
        casosActivos: body.activos,
        acumulados: body.acumulados,
        muertes: body.muertes
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
            longitud: body.lng,
            acumulados: body.acumulados
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

app.put('/estadoUpdate', (req, res) => {
    let body = req.body;

    Estados.findOneAndUpdate({ nombre: body.nombre }, { $set: { acumulados: body.acumulados, casosActivos: body.activos, muertes: body.muertes } }, { new: true }, (err, user) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            status: "database update"
        });
    });

});

app.put('/ciudadUpdate', (req, res) => {
    let body = req.body;

    Ciudades.findOneAndUpdate({ nombre: body.nombre }, { $set: { acumulados: body.acumulados } }, { new: true }, (err, user) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            status: "database update"
        });
    });

});

app.put('/historial', function(req, res) {
    let bandera = null;
    let body = req.body;
    let DiaActual = null;
    let history = null;

    if (body.date === undefined) {
        DiaActual = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        history = new Historial({
            fecha: DiaActual,
            activos: body.activos,
            muertes: body.muertes
        });
    } else {
        DiaActual = body.date;
        history = new Historial({
            fecha: body.date,
            activos: body.activos,
            muertes: body.muertes
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
            status: "database update"
        });
    }).then(() => {
        if (bandera === null) {

            Ciudades.findOneAndUpdate({ nombre: body.nombre }, { $addToSet: { historial: history } }, { safe: true, new: true }, () => {

            });

        }
    });
});


module.exports = app;