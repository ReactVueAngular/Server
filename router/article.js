var mongoose = require('mongoose'),
    express = require('express'),
    ArticleController = require('../controllers/article'),
    router = express.Router(),
    multipart = require('connect-multiparty'),
    md_upload = multipart({ uploadDir: './upload/articles' });
/* rutaspruebas */
router.get('/datos-cursos', ArticleController.datoCurso);
router.get('/test-controllador', ArticleController.test);
/* rutas utiles */
router.post('/save', ArticleController.save);
router.get('/getArticulos/:last', ArticleController.getArticles);
router.get('/getArticulo/:id', ArticleController.getArticle);
router.put('/getArticulo/:id', ArticleController.update);
router.delete('/getArticulo/:id', ArticleController.delete);
router.post('/upload-img/:id', md_upload, ArticleController.upload);
router.get('/get-img/:img', md_upload, ArticleController.getImage);
router.get('/search/:search', ArticleController.search);

module.exports = router;