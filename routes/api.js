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
var posts = require(__dirname+'/posts.js');


var Author = thinky.createModel('Author', {
    id: type.string(),
    name: type.string(),
    email: type.string(),
    website: type.string()
});
var Comment = thinky.createModel('Comment', {
    id: type.string(),
    name: type.string(),
    comment: type.string(),
    postId: type.string(),
    date: type.date().default(r.now())
});


// Specify the relations

// A post has one author that we will keep in the field `author`.
posts.Post.belongsTo(Author, "author", "authorId", "id");
Author.hasMany(posts.Post, "posts", "id", "authorId");

// A post has multiple comments that we will keep in the field `comments`.
posts.Post.hasMany(Comment, "comments", "id", "postId");
Comment.belongsTo(posts.Post, "post", "postId", "id");


// Make sure that an index on date is available
posts.Post.ensureIndex("date");
Author.ensureIndex("name");





// Retrieve all authors
exports.authors = function (req, res) {
    Author.orderBy({index: 'name'}).run().then(function(authors) {
        res.json({
            authors: authors
        });
    }).error(handleError(res));
};


// Retrieve one author
exports.author = function (req, res) {
    var id = req.params.id;

    Author.get(id).run().then(function(author) {
        res.json({
            author: author
        });
    }).error(handleError(res));
};


// Save an author in the database
exports.addAuthor = function (req, res) {
    var author = new Author(req.body);

    author.save().then(function(result) {
        res.json({
            result: result
        });
    }).error(handleError(res));
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
        }).error(handleError(res));
    }).error(handleError(res));
};


// Edit an author
exports.editAuthor = function (req, res) {
    // Update an author
    Author.get(req.body.id).update(req.body).run().then(function(author) {
        res.json({
            author: author
        })
    }).error(handleError(res));
};


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
