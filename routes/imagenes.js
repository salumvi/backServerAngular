
var express = require('express');

var app = express();
const path = require('path');
const fs = require('fs');

app.get('/:tipo/:img', (req, res, next) => {


    var tipo = req.params.tipo;
    var img = req.params.img;
    const pathImg = path.resolve(__dirname, `../uploads/${tipo}/${img}`);


    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        var pathNoimage = path.resolve(__dirname, '../uploads/no-img.jpg');
        res.sendFile(pathNoimage);
    }


});

module.exports = app;
