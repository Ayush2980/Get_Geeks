const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const app = express();
const path = require('path');
const request = require('request');
const cookieParser = require('cookie-parser');
const XMLHttpRequest = require('xhr2');
const xhr = new XMLHttpRequest();



//Controller imports
const fetcher = require('./controllers/codechef');
const helper = require('./controllers/codeforces');
const { name } = require('ejs');

app.engine('ejs' , ejsMate);
app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname , './views'));
app.use(express.static('public'))
app.use(cookieParser());


app.get('/find' , (req , res) => {
  res.render('pages/homepage')
})


app.get('/login' , (req , res) => {
  res.render('pages/Authentication_login');
})


app.get('/fetch' ,  async(req , res) => {
    if(req.query.handle === "CF"){
      const userData = await helper.searchCF(req.query.search);
      res.render('pages/findCF' , {userData});
    }
    else if(req.query.handle === "CC"){
      const userData = await fetcher.searchCode(req.query.search);
      res.render('pages/findCC' , {userData});
    }
});









app.listen(8000 , () => {
    console.log('Listening on port 8000 !!!');
})