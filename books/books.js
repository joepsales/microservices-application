// Dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// File variables
const PORT = 3000;

// Parse JSON
app.use(bodyParser.json());

// Define Model
require('./Book');
const Book = mongoose.model('Book')

// Connect to dabatae
mongoose.connect('mongodb+srv://salesjoep:fontys@booksservice.wopsp.mongodb.net/booksservice?retryWrites=true&w=majority', () => {
    try{
        console.log('Books Database connected.');
    } catch{
        console.log('Could not connect to books database.');
    }
});


// Main route
app.get('/', (req, res) => {
    res.send('This is our main endpoint');
})

// Create book
app.post('/book', (req, res) => {
    var newBook = {
        title: req.body.title,
        author: req.body.author,
        numberPages: req.body.numberPages,
        publisher: req.body.publisher
    }

    var book = new Book(newBook)
    book.save().then(() => {
        console.log('New book created.');
    }).catch((err) => {
        if (err){
            throw err;
        }
    })
})

// Get all books
app.get('/books', (req, res) => {
    Book.find().then((books) => {
        res.json(books)
    }).catch(err => {
        if (err){
            throw err;
        }
    })
})

// Get book by ID
app.get('/book/:id', (req, res) => {
    Book.findById(req.params.id).then((book) => {
        if(book) {
            res.json(book);
        } else{
            res.sendStatus(404);
        }
    }).catch(err => {
        if(err){
            throw err;
        }
    })
})

app.delete('/book/:id', (req, res) => {
    Book.findOneAndDelete(req.params.id).then(() => {
        res.send('Book removed.');
    }).catch(err => {
        if(err){
            throw err;
        }
    })
})

// Run application on port
app.listen(PORT, () => {
    console.log(`Books service running on ${PORT}`);
});