// Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

// Set up the body parser
app.use(bodyParser.json());

// Set up the server
app.listen(3000, function () {
    console.log('Server is listening on port 3000');
});

// Set up the routes
app.get('/', function (req, res) {
    res.send('Hello, World!');
});

app.get('/comments', function (req, res) {
    var comments = loadComments();
    res.send(comments);
});

app.post('/comments', function (req, res) {
    var comments = loadComments();
    var newComment = req.body;
    newComment.id = comments.length + 1;
    comments.push(newComment);
    saveComments(comments);
    res.send(newComment);
});

app.put('/comments/:id', function (req, res) {
    var comments = loadComments();
    var id = parseInt(req.params.id);
    var index = comments.findIndex(function (comment) {
        return comment.id === id;
    });
    if (index !== -1) {
        comments[index] = req.body;
        saveComments(comments);
        res.send(comments[index]);
    } else {
        res.status(404).send('Comment not found');
    }
});

app.delete('/comments/:id', function (req, res) {
    var comments = loadComments();
    var id = parseInt(req.params.id);
    var index = comments.findIndex(function (comment) {
        return comment.id === id;
    });
    if (index !== -1) {
        comments.splice(index, 1);
        saveComments(comments);
        res.send('Comment deleted');
    } else {
        res.status(404).send('Comment not found');
    }
});

// Helper functions
function loadComments() {
    try {
        var comments = fs.readFileSync('comments.json', 'utf8');
        return JSON.parse(comments);
    } catch (error) {
        return [];
    }
}

function saveComments(comments) {
    var commentsPath = path.join(__dirname, 'comments.json');
    var commentsJSON = JSON.stringify(comments, null, 2);
    fs.writeFileSync(commentsPath, commentsJSON);
}
// Create a comments.json file and add an empty array
var commentsPath = path.join(__dirname, 'comments.json');