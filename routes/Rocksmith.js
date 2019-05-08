const {Song, validate} = require('../models/Song'); 
const mongoose = require('mongoose');
const express = require('express');
const config = require('config');
const router = express.Router();
const {writeData} = require("../csv");

function parseParam(input){
    var inpArr = input.split(',');
    for( var i=0; i < inpArr.length; i++ ){
        inpArr[i] = new RegExp(inpArr[i], 'i');
    }
    return inpArr;
}


router.get('/', async (req, res) => {

    // Get the parameters and parse them into arrays of regular expressions.
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

    var key = req.body.key;
    if (!key){ return res.status(401).send("Error: Cannot Put - No Authentication Key was provided"); }

    var authKey = config.get('rocksmithAuthKey');
    if (authKey !== key) {
        return res.status(400).send("Bad Request."); 
    }

    if(!req.body.songs) { return res.status(400).send("Bad Request - No Songs listed") };



    var songs = req.body.songs;
    if (typeof(songs) === 'object' && songs.constructor === Array){
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
        const { error } = validate(songs);
        if (error) return res.status(400).send(error.details[0].message);

        let song = new Song({
            artist: songs.artist,
            name: songs.name,
            leadTuning: songs.leadTuning,
            rhythmTuning: songs.rhythmTuning,
            bassTuning: songs.bassTuning,
        })

        song = await song.save();
    }

    return res.send("Song successfully posted.");
})

router.copy('/', async (req, res) => {
        var key = req.body.key;
        if (!key){ return res.status(401).send("Error: Cannot Put - No Authentication Key was provided"); }

        var authKey = config.get('rocksmithAuthKey');
        if (authKey != key) { return res.status(400).send("Bad Request."); }

        const songs = await Song.find().select("artist name leadTuning rhythmTuning bassTuning -_id").sort('artist');

        var err = writeData(songs);
        if (err){
            res.status(500).send("There was an error writing the file");
        } else {
            res.send("File has been successfully written");
        }

    }
)

module.exports = router;