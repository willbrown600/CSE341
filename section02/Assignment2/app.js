const express = require('express');
const path = require('path');
const app = express();

const rootRoute = require('./routes/root');

app.use(express.static(path.join(__dirname, 'css')));

app.use(rootRoute);

app.listen(3000);