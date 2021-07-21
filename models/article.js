const mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    ArticleSchema = Schema({
        titulo: String,
        content: String,
        date: { type: Date, default: Date.now },
        image: String
    });


module.exports = mongoose.model('Article', ArticleSchema)