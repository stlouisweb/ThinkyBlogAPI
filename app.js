// Import
var express = require('express');
var api = require('./routes/api');
var config = require('./config.js');
var posts = require('./routes/posts.js');
var authors = require('./routes/authors.js');
var bodyParser = require('body-parser');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// // parse application/json
app.use(bodyParser.json())

// Routes
app.route('/').get(function (req, res) {
  res.json({
    result: 'hello'
  }).error(console.log(error.message), res.send(500, {error: error.message}));
});

// Post API
app.route('/api/posts').get(posts.posts);
app.route('/api/post/:id').get(posts.post);
app.route('/api/post_and_authors/:id').get(posts.postAndAuthors);
app.route('/api/post').post(posts.addPost);
app.route('/api/post/:id').delete(posts.deletePost);
app.route('/api/post/:id').put(posts.editPost);

// Author API
app.route('/api/authors').get(authors.authors);
app.route('/api/author/:id').get(authors.author);
app.route('/api/author').post(authors.addAuthor);
app.route('/api/author/:id').delete(authors.deleteAuthor);
app.route('/api/author/:id').put(authors.editAuthor);

// Comment API
app.route('/api/comment').post(api.addComment);
app.route('/api/comment/:id').delete(api.deleteComment);

// Redirect all others to the index
// A 404 page is probably a better move
//app.route('*').get(routes.index);

// route to authenticate a user (POST http://localhost:3000/api/authenticate)
app.route('/api/authenticate').post(api.authenticate);

// Start server
app.listen(config.expressPort, function(){
    console.log("Express server listening on port %d in %s mode",
        config.expressPort, app.settings.env);
});
