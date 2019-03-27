const {Song, validate} = require('../models/Song'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

function parseParam(input){
    var inpArr = input.split(',');
    for( var i=0; i < inpArr.length; i++ ){
        inpArr[i] = new RegExp(inpArr[i], 'i');
    }
    return inpArr;
}


router.get('/', async (req, res) => {

    // Get the parameters and parse them into arrays for easier searching later.
    let queryParams = req.query;
    if (queryParams["artist"]) { queryParams["artist"] = parseParam(queryParams["artist"]) };
    if (queryParams["song"]) { queryParams["song"] = parseParam(queryParams["song"]) };
    if (queryParams["leadTuning"]) { queryParams["leadTuning"] = parseParam(queryParams["leadTuning"]) };
    if (queryParams["rhythmTuning"]) { queryParams["rhythmTuning"] = parseParam(queryParams["rhythmTuning"]) };
    if (queryParams["bassTuning"]) { queryParams["bassTuning"] = parseParam(queryParams["bassTuning"]) };

    const songs = await Song.find( queryParams ).select("artist name leadTuning rhythmTuning bassTuning -_id").sort('artist');
    
    
    res.send(JSON.stringify(songs));
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