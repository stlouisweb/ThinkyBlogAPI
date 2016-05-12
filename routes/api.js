/*
* api.js
*
* Sets up relations and default routes.
*/

// Import
var config = require(__dirname+'/../config.js');
var thinky = require('thinky')(config);
var r = thinky.r;
var type = thinky.type;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var posts = require('./posts.js');
var authors = require('./authors.js');

var Comment = thinky.createModel('Comment', {
    id: type.string(),
    name: type.string(),
    comment: type.string(),
    postId: type.string(),
    date: type.date().default(r.now())
});


// Specify the relations

// A post has one author that we will keep in the field `author`.
posts.Post.belongsTo(authors.Author, "author", "authorId", "id");
authors.Author.hasMany(posts.Post, "posts", "id", "authorId");

// A post has multiple comments that we will keep in the field `comments`.
posts.Post.hasMany(Comment, "comments", "id", "postId");
Comment.belongsTo(posts.Post, "post", "postId", "id");


// Make sure that an index on date is available
posts.Post.ensureIndex("date");
authors.Author.ensureIndex("name");

// Add a comment
exports.addComment = function (req, res) {
    var newComment = new Comment(req.body);

    newComment.save().then(function(error, result) {
        res.json({
            error: error,
            result: result
        });
    });
};


// Delete comment
exports.deleteComment = function (req, res) {
    var id = req.params.id;

    // We can directly delete the comment since there is no foreign key to clean
    Comment.get(id).delete().run().then(function(error, result) {
        res.json({
            error: error,
            result: result
        })
    });
};

//authenticate user
exports.authenticate = function (req, res) {

  /* @TODO THIS IS A TEST
   * Implement the commented out functionality below
   */
  // create a token
  var token = jwt.sign({user: 'testuser'}, 'poop', { expiresIn: '1h' });

  // return the information including token as JSON
  res.json({
    success: true,
    message: 'Enjoy your token!',
    token: token
  });

  // find the user
  // User.findOne({
  //   name: req.body.name
  // }, function(err, user) {
  //
  //   if (err) throw err;
  //
  //   if (!user) {
  //     res.json({ success: false, message: 'Authentication failed. User not found.' });
  //   } else if (user) {
  //
  //     // check if password matches
  //     if (user.password != req.body.password) {
  //       res.json({ success: false, message: 'Authentication failed. Wrong password.' });
  //     } else {
  //
  //       // if user is found and password is right
  //       // create a token
  //       var token = jwt.sign(user, app.get('superSecret'), {
  //         expiresInMinutes: 1440 // expires in 24 hours
  //       });
  //
  //       // return the information including token as JSON
  //       res.json({
  //         success: true,
  //         message: 'Enjoy your token!',
  //         token: token
  //       });
  //     }
  //
  //   }

  // });
};

function handleError(res) {
    return function(error) {
        console.log(error.message);
        return res.send(500, {error: error.message});
    }
}
exports.handleError = handleError;
