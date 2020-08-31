// This is where I set up all the third party stuff.

const helmet = require('helmet');
const compression = require('compression');
const express = require('express');
const cors = require('cors')

module.exports = function(app) {

    if (process.env.NODE_ENV === "production"){
        app.use(helmet());
        app.use(compression());
    }
    app.use(express.json());
    app.use(cors());

}