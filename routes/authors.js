/*
* authors.js
*
* Sets up posts model, and CRUD method server routes.
*/
// Import
var config = require(__dirname+'/../config.js');
var thinky = require('thinky')(config);
var r = thinky.r;
var type = thinky.type;
var api = require('./api');

var Author = thinky.createModel('Author', {
    id: type.string(),
    name: type.string(),
    email: type.string(),
    website: type.string()
});
exports.Author = Author;

// Retrieve all authors
exports.authors = function (req, res) {
    Author.orderBy({index: 'name'}).run().then(function(authors) {
        res.json({
            authors: authors
        });
    }).error(api.handleError(res));
};


// Retrieve one author
exports.author = function (req, res) {
    var id = req.params.id;

    Author.get(id).run().then(function(author) {
        res.json({
            author: author
        });
    }).error(api.handleError(res));
};


// Save an author in the database
exports.addAuthor = function (req, res) {
    var author = new Author(req.body);

    author.save().then(function(result) {
        res.json({
            result: result
        });
    }).error(api.handleError(res));
};


// Delete an author
exports.deleteAuthor = function (req, res) {
    var id = req.params.id;

    // Delete an author and update all the post referencing the author
    Author.get(id).getJoin({posts: true}).run().then(function(author) {
        author.delete().then(function(author) {
            res.json({
                result: author
            })
        }).error(api.handleError(res));
    }).error(api.handleError(res));
};


// Edit an author
exports.editAuthor = function (req, res) {
    // Update an author
    Author.get(req.body.id).update(req.body).run().then(function(author) {
        res.json({
            author: author
        })
    }).error(api.handleError(res));
};
