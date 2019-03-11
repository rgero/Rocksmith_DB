const {Song, validate} = require('../models/Song'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const songs = await Song.find().sort('artist');
    res.send(songs);
})

module.exports = router;