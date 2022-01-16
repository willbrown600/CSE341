const express = require('express');

const app = express();

app.use('/users', (req, res, next) => {
    res.send('<h1>Users page</h1>');
})

app.use('/', (req, res, next) => {
    res.send('<h1>Root page</h1>');
})

app.listen(4000);