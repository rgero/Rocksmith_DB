const {Song, validate} = require('../models/Song'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {

    // Get the parameters and parse them into arrays for easier searching later.
    let queryParams = req.query;
    if (queryParams["artist"]) { queryParams["artist"] = queryParams["artist"].split(',') };
    if (queryParams["song"]) { queryParams["song"] = queryParams["song"].split(',') };
    if (queryParams["leadTuning"]) { queryParams["leadTuning"] = queryParams["leadTuning"].split(',') };
    if (queryParams["rhythmTuning"]) { queryParams["rhythmTuning"] = queryParams["rhythmTuning"].split(',') };
    if (queryParams["bassTuning"]) { queryParams["bassTuning"] = queryParams["bassTuning"].split(',') };

    console.log(queryParams)

    var songString = "";
    const songs = await Song.find( queryParams ).select("artist name leadTuning rhythmTuning bassTuning -_id").sort('artist');
    
    
    res.send(songs);
})

router.put('/', async (req, res) => {
    var songs = req.body;
    if (typeof(songs) === 'object' && songs.constructor === Array){
        console.log("We got an array");
        songs.forEach( async (song) => {
            const { error } = validate(song);
            if (error) return res.status(400).send(error.details[0].message);
    
            let newSong = new Song({
                artist: song.artist,
                name: song.name,
                leadTuning: song.leadTuning,
                rhythmTuning: song.rhythmTuning,
                bassTuning: song.bassTuning,
            })
    
            newSong = await newSong.save();
        })
    } else {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let song = new Song({
            artist: req.body.artist,
            name: req.body.name,
            leadTuning: req.body.leadTuning,
            rhythmTuning: req.body.rhythmTuning,
            bassTuning: req.body.bassTuning,
        })

        song = await song.save();
    }

    res.send("Ok");
})

module.exports = router;