const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');

app.use(bodyParser.json());

require('./Order');
const Order = mongoose.model('Order');

mongoose.connect('mongodb+srv://salesjoep:fontys@booksservice.wopsp.mongodb.net/ordersservice?retryWrites=true&w=majority', () => {
    try{
        console.log('Orders Database connected.');
    } catch{
        console.log('Could not connect to order database.');
    }
});

// POST new Order
app.post('/order', (req, res) => {

    var newOrder = {
        CustomerID: mongoose.Types.ObjectId(req.body.CustomerID),
        BookID: mongoose.Types.ObjectId(req.body.BookID),
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate
    }

    var order = new Order(newOrder)

    order.save().then(() => {
        res.send("Order created.");
    }).catch((err) => {
        if(err) throw err;
    })
})

app.get("/orders", (req, res) => {

    Order.find().then((books) => {
        res.json(books)
    }).catch((err) => {
        if(err){
            throw err;
        }
    })
})

app.get('/order/:id', (req, res) => {
    Order.findById(req.params.id).then((order) => {
        if(order){
            axios.get('http://localhost:3001/customer/' + order.CustomerID)
            .then((response) => {
                var orderObject = { customerName: response.data.name, bookTitle: '' }

                axios.get('http://localhost:3000/book/' + order.BookID)
                .then((response) => {
                    orderObject.bookTitle = response.data.title;
                    res.json(orderObject);
                });
            })
            
        }else {
            res.send('Invalid order.');
        }
    })
})

const PORT = 3002;

app.listen(PORT, () => {
    console.log(`Orders service running on ${PORT}`);
})