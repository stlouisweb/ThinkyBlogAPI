/*
* posts.js
*
* Sets up posts model, and CRUD method server routes.
*/
// Import
var config = require(__dirname+'/../config.js');
var thinky = require('thinky')(config);
var r = thinky.r;
var type = thinky.type;
var api = require('./api');

// Create the models
// Note: if we don't provide the field date, the default function will be called
var Post = thinky.createModel('Post', {
    id: type.string(),
    title: type.string(),
    text: type.string(),
    authorId: type.string(),
    date: type.date().default(r.now)
});
exports.Post = Post;

// Retrieve a list of posts ordered by date with its author and comments
exports.posts = function (req, res) {
    Post.orderBy({index: r.desc('date')}).getJoin({author: true, comments: {_order: "date"}}).run().then(function(posts) {
        res.json({
            posts: posts
        });
    }).error(api.handleError(res));
};


// Retrieve one post with its author and comments
exports.post = function (req, res) {
    var id = req.params.id;
    Post.get(id).getJoin({author: true, comments: {_order: "date"}}).run().then(function(post) {
        res.json({
            post: post
        });
    }).error(api.handleError(res));
};


// Retrieve a post and all the available authors
exports.postAndAuthors = function (req, res) {
    var id = req.params.id;
    Post.get(id).run().then(function(post) {
        Author.run().then(function(authors) {
            res.json({
                post: post,
                authors: authors
            });
        }).error(api.handleError(res));
    }).error(api.handleError(res));
};


// Save a post in the database
exports.addPost = function (req, res) {
    var newPost = new Post(req.body);

    newPost.save().then(function(result) {
        res.json({
            result: result
        });
    }).error(api.handleError(res));
};


// Delete a post and its comments from the database
exports.deletePost = function (req, res) {
    var id = req.params.id;

    // Delete a post and all its comments
    Post.get(id).getJoin({comments: true}).run().then(function(post) {
        post.deleteAll({comments: true}).then(function(result) {
            res.json({
                result: result
            });
        }).error(api.handleError(res));
    }).error(api.handleError(res));
};


// Update a post in the database
exports.editPost = function (req, res) {
    Post.get(req.body.id).run().then(function(post) {
        post.title = req.body.title;
        post.text = req.body.text;
        post.authorId = req.body.authorId;
        post.save().then(function(post) {
            res.json({
                post: post
            });
        }).error(api.handleError(res));
    }).error(api.handleError(res));
};
