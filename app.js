const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const app = express();
const path = require('path');
const request = require('request');

//Controller imports
const fetcher = require('./controllers/codechef');
const helper = require('./controllers/codeforces');

app.engine('ejs' , ejsMate);
app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname , './views'));
app.use(express.static('public'))


app.get('/find' , (req , res) => {
  res.render('pages/homepage')
})



app.get('/fetch' ,  async(req , res) => {
    if(req.query.handle === "CF"){
      const userData = await helper.searchCF(req.query.search);
      console.log(userData)
      res.render('pages/findCF' , {userData})
    }
    else if(req.query.handle === "CC"){
      const userData = await fetcher.searchCode(req.query.search);
      res.render('pages/findCC' , {userData})
    }
});


app.get("/s" , async (req , res) => {
  const api_url ="https://zenquotes.io/api/quotes/";

  async function getapi(url)
  {
    const response = await fetch(url);
    var data = await response.json();
    return data;
  }
  
  let x = Math.floor((Math.random() * 49));
  const dataAPI = await getapi(api_url);  
  const quoteOBJ = dataAPI[x];
  console.log(quoteOBJ)
  res.render('partials/loader.ejs' , {quoteOBJ});
})










app.listen(8000 , () => {
    console.log('Listening on port 8000 !!!');
})