# Thinky - RethinkDB - ~~Angular~~ -  Express - example


This app is a simple blog with posts, comments and authors.

~~The main purpose of this app is to show how to use [thinky](http://github.com/neumino/thinky)
with the JOIN operations.~~

The main purpose of this app is to show how to use thinky to create a REST API you can plug into your front ends.

## Install
Install the dependencies
```
npm install
```

Init the database. Change the content of `config.js` if you want.  


This is an optional step.
Run `node init.js` to populate the blog with some documents.
If you don't, thinky will automatically create tables.

## Run the app
Start the server
```
node app.js
```

Access REST endpoints at     
`http://localhost:3000/api/{endpoint}`

### Note

Based on the [Thinky - RethinkDB - Angular - Express - example](https://github.com/neumino/thinky/tree/master/examples/blog)
