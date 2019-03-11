const Joi = require('joi');
const mongoose = require('mongoose');

const Song = mongoose.model('Song', new mongoose.Schema({
    artist: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50
    },
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 125
    },
    leadTuning: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    rhythmTuning: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    bassTuning: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    }
}));

function validateSong(song){
    const schema = {
        artist: Joi.string().min(1).max(50).required(),
        name: Joi.string().min(1).max(125).required(),
        leadTuning: Joi.string().min(1).max(50).required(),
        rhythmTuning: Joi.string().min(1).max(50).required(),
        bassTuning: Joi.string().min(1).max(50).required(),
      };
    return Joi.validate(song, schema);
}

async function checkExistence(){
    var song;
    await Song.find().limit(1).then( (s) => {song = s});
    if (song.length > 0)
    {
        return true;
    } else {
        return false;
    }
}

exports.Song = Song; 
exports.validate = validateSong;
exports.checkExistence = checkExistence;