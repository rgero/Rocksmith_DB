const _ = require("lodash");
const fs = require('fs') 

const defaultSongObj = {
    artist: "",
    song: "",
    leadTuning: "",
    rhythmTuning: "",
    bassTuning: "" 
}

function parseData(dataSourceLoc){
    var masterSongList = [];
    var dataString =  fs.readFileSync(dataSourceLoc).toString();

    var songList = dataString.split(/\n/)
    songList.forEach( (song)=> {
        song = _.trim(song)
        song = song.split('|')
        var newSong = defaultSongObj;
        if (song.length === 5) {
            newSong.artist = song[1];
            newSong.song = song[0];
            newSong.leadTuning = song[2];
            newSong.rhythmTuning = song[3];
            newSong.bassTuning = song[4];
        }
        masterSongList.push(newSong);
    })

    return masterSongList;
};

module.exports.parse = parseData;