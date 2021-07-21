var mongoose = require('mongoose'),
    app = require('./app'),
    port = 5050;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/reactAngularVue', { useNewUrlParser: true })
    .then(() => {
        console.log("conexion a la base de datos");
        /* crear servidor y peticiones http*/
        app.listen(port, () => {
            console.log("Servidor corriendo en https://localhost:" + port);
        });


    });

//