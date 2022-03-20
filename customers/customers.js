const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const PORT = 3001;

require('./Customer');
const Customer = mongoose.model('Customer');

mongoose.connect('mongodb+srv://salesjoep:fontys@booksservice.wopsp.mongodb.net/customersservice?retryWrites=true&w=majority', () => {
    try{
        console.log('Customer Database connected.');
    } catch{
        console.log('Could not connect to customer database.');
    }
});

// Create customer
app.post('/customer', (req, res) => {
    var newCustomer = {
        name: req.body.name,
        age: req.body.age,
        address: req.body.address
    }

    var customer = new Customer(newCustomer);
    customer.save().then(() => {
        res.send('Customer created.')
    }).catch((err) => {
        if(err){
            throw err;
        }
    })
})

// GET all customers
app.get('/customers', (req, res) => {
    Customer.find().then((customers) => {
        res.json(customers);
    }).catch((err) => {
        if(err){
            throw err;
        }
    })
})

//GET a specific customer
app.get('/customer/:id', (req, res) => {
    Customer.findById(req.params.id).then((customer) => {
        if(customer){
            res.json(customer);
            console.log(customer);
        } else{
            res.send('Invalid ID.');
        }
    }).catch((err) => {
        if(err){
            throw err;
        }
    })
})

// DELETE a specific customer
app.delete('/customer/:id', (req, res) => {
    Customer.findByIdAndDelete(req.params.id).then(() => {
        res.send('Customer deleted.');
    }).catch((err) => {
        if(err){
            throw err;
        }
    })
})

app.listen(PORT, () => {
    console.log(`Customer service running on ${PORT}`);
})