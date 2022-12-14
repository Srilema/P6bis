const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
mongoose.connect('mongodb+srv://Srilema:2a8ff970d4@testcluster.cydntcq.mongodb.net/test',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
.then(()=>console.log('Connection à MongoDB réussi'))
.catch(()=>console.log('Connection à MongoDB échoué'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

const userRoutes = require('./routes/user');
app.use('/api/auth', userRoutes);
//app.use('/images', express.static(path.join(__dirname, 'images')));
const saucesRoutes= require('./routes/sauces');
app.use('/api/sauces', saucesRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;