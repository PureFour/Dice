const express = require('express');

const app = express();

app.use(express.static('public'));
app.use(express.static('src'));
app.use(express.static('resources'));

module.exports = app;