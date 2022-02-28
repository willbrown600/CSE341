/* const http = require('http');
const script = require('script');

const server = http.createServer((req, res) => {
    script.getData();
})


server.listen(8080); */

const express = require('express');
const bodyParser = require('body-parser');
//Use script file
const routes = require('./routes');
//Create node project
const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/', routes);

app.listen(8080);