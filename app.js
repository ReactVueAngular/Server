/* cargar modulos */
const express = require('express'),
    bodyParser = require('body-parser'),
    /* ejecutar express */
    app = express(),
    /* cargar ficheros de rutas */
    article_router = require('./router/article');
/* middlewares */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
/* activar cors */
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

/* añadir prefijo a la ruta */
app.use('/api', article_router);
/*
 app.get('/probando', (req, res) => {
    var params = req.body.hola;
    return res.status(200).send({
        curso: "master",
        nombre: "bryan ct",
        edad: 18,
        url: "http://brayanct.com",
        hola
    });
});
 */
/* exportar modulo(ficheri actual) */
module.exports = app;