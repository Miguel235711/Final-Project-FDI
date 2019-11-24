const express = require('express');
//import models from './models'
const assert = require('assert');
//import models, { connectDb } from './models';
//const models,{connectDB} = require('./models');
const app = express();
//const router = express.Router();

app.set('view engine','ejs');///ejs view engine
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use( express.static( "public" ) );

app.get('/',(req,res)=>{
    res.render('home.ejs');
});
app.get('/profile',(req,res)=>{
    res.render('profile.ejs');
});
app.get('/people',(req,res)=>{
    res.render('people.ejs');
});
app.get('/research',(req,res)=>{
    res.render('research.ejs');
});
app.get('/publications',(req,res)=>{
    res.render('publications.ejs');
});

app.listen(3000,()=>{
    console.log('Server started on port 3000');
});