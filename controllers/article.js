var validator = require('validator'),
    fs = require('fs'),
    path = require('path'),
    Article = require('../models/article'),

    articleController = {

        datoCurso: (req, res) => {

            var params = req.body.hola;

            return res.status(200).send({
                curso: "master",
                nombre: "bryan ct",
                edad: 18,
                url: "http://brayanct.com",
                hola
            })
        },
        test: (req, res) => {
            return res.status(200).send({
                message: "Soy la accion test del controlador de articulos"
            })
        },
        save: (req, res) => {
            //recoger parametros post
            var params = req.body;

            //validar datos
            try {
                var validate_title = !validator.isEmpty(params.title);
                var validate_content = !validator.isEmpty(params.content);

            } catch (err) {
                return res.status(404).send({
                    status: 'error',
                    message: "Faltan datos para enviar"
                });
            }
            if (validate_title && validate_content) {

                //crear el bojeto a guardar
                var article = new Article();
                //asignar valores
                article.title = params.title;
                article.content = params.content;
                article.image = null;
                //guardar el articulos
                article.save((err, articleStored) => {

                    if (err || !articleStored) {

                        return res.status(404).send({
                            status: 'error',
                            message: "El articulo no se guardo"

                        });
                    }
                    //devolver una respuesta
                    return res.status(200).send({
                        status: 'success',
                        article: articleStored
                    });

                });

            } else {
                return res.status(404).send({
                    status: 'error',
                    message: "Los datos no son correctos"

                });
            }
        },
        getArticles: (req, res) => {
            var query = Article.find({}),
                last = req.params.last;
            if (last || last != undefined) {
                query.limit(5)
            }

            query.exec((err, articles) => {
                if (err) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'error al devolver los datos'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    articles
                });
            });
        },
        getArticle: (req, res) => {
            //recogemos el id de la url
            var articleId = req.params.id;
            //comprobar que existe
            if (!articleId || articleId == null) {
                return res.status(404).send({
                    status: 'error',
                    message: 'no esxiste el articulo'
                });
            }
            //buscar el articulo
            Article.findById(articleId, (err, article) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'error al devolver los datos'
                    });
                }
                if (!article) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'no esxiste el articulo'
                    });
                }
                //devolver el json
                return res.status(200).send({
                    status: 'success',
                    article
                });
            });


        },
        update: (req, res) => {
            //recoger el id del articulo por url
            var articleId = req.params.id;
            //recoger los datos que llegan por put
            var params = req.body;
            //validar datos 
            try {
                var validate_title = !validator.isEmpty(params.title),
                    validate_content = !validator.isEmpty(params.content);
            } catch (err) {
                return res.status(200).send({
                    status: 'error',
                    message: 'faltan datos por enviar'
                });
            }
            if (validate_title && validate_content) {
                //find and update
                Article.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'error al actualizar'
                        });
                    }
                    if (!articleUpdated) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'no existen ningun dato'
                        });
                    }
                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                });
            } else {
                return res.status(200).send({
                    status: 'error',
                    message: 'la validacion no es correcta'
                });
            }

            //devolver respuesta


        },
        delete: (req, res) => {
            //recoger el id de la url
            var articleId = req.params.id;

            //fin de eliminar
            Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'no se pudo borrar los archivos'
                    });
                }
                if (!articleRemoved) {
                    return res.status(200).send({
                        status: 'error',
                        message: 'no se borro el articulo posiblemente no existe '
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleRemoved
                });
            })

        },
        upload: (req, res) => {
            //configurar el modulo del modulo multiparty
            var file_name = 'imagen no subida...';
            if (!req.files) {
                return res.status(404).send({
                    status: '404 Not Found',
                    message: file_name
                });
            }
            //recoger el fichero de la peticion
            //conseguir el nombre y la extencion del archivo
            var file_path = req.files.file0.path,
                //file_split = file_path.split('\\'),
                //linux o mac
                file_split = file_path.split('/'),
                //nombre del archivo
                file_name = file_split[2],
                //extencion del fichero del archivo
                extension_split = file_name.split('\.'),
                file_ext = extension_split[1];

            //comprobar la extension de img o borrar los ficheros
            if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'gif' && file_ext != 'jpeg') {
                //borrar el archivo subido 
                fs.unlink(file_path, (err) => {
                    return res.status(404).send({
                        status: '404 Not Found',
                        message: 'la extencion no es valida seleccione otra imagen'
                    });
                });
            } else {
                //si todo es valido
                var articleId = req.params.id;
                //busca el articulo asignado el nombre de la imagen y actualizarlo
                Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }, (err, articleUpdated) => {
                    if (err || !articleUpdated) {
                        return res.status(200).send({
                            status: 'error',
                            message: 'error al guardar la imagen del articulo!!'
                        });
                    }
                    return res.status(200).send({
                        status: 'success',
                        message: 'la imagen se guardo correctamente'
                    });
                });
            }
            //buscar el articulo asignado y el nombre de la imagen y actualizar
        },
        getImage: (req, res) => {
            var file = req.params.image;
            var path_file = './upload' + file;
            fs.exists(path_file, (exists) => {
                if (exists) {
                    return res.sendFile(path.resolve(path_file));
                } else {
                    return res.status(404).send({
                        status: 'error',
                        message: 'La imagen no existe'
                    });
                }
            });

        },
        search: (req, res) => {
            //sacar el string a buscar
            var searchString = req.params.search;
            //find or
            Article.find({
                    "$or": [{ "title": { "$regex": searchString, "$options": "i" } },
                        { "content": { "$regex": searchString, "$options": "i" } }
                    ]
                })
                .short([
                    ['date', 'descending']
                ])
                .exec((err, article) => {
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'error en la peticion!!'
                        });
                    }
                    if (!articles || articles.length <= 0) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'no hay articulos que coincidan en tu busqueda!!'
                        });
                    }
                    return res.status(200).send({
                        status: 'error',
                        article
                    });
                });
        }

    }; //fin controlador
/* Exportar controladores */
module.exports = articleController;