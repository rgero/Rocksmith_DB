const _ = require("lodash");
const fs = require('fs') 

function parseData(dataSourceLoc){
    var masterSongList = [];
    var dataString =  fs.readFileSync(dataSourceLoc).toString();

    var songList = dataString.split(/\n/)
    songList.forEach( (song)=> {
        song = _.trim(song)
        song = song.split('|')
        var newSong = {};
        if (song.length === 5) {
            newSong.artist = song[1];
            newSong.name = song[0];
            newSong.leadTuning = song[2];
            newSong.rhythmTuning = song[3];
            newSong.bassTuning = song[4];
            masterSongList.push(newSong);
        }
        
    })
    return masterSongList;
};

async function writeData(songList)
{
    //Convert song list to CSV string
    var csvString = "";
    songList.forEach( (song) => {
        csvString = csvString + song.artist + "|" + song.name + "|" + song.leadTuning + "|" + song.rhythmTuning + "|" + song.bassTuning + "\n";
    })

    var filePath = "Rocksmith.csv";
    var err = null;

    // Write File
    err = fs.writeFile(filePath, csvString, function(err) {
        if(err) {
            console.log(err);
            return err;
        }
        console.log("The file was saved!");
    })

    return err;
}

module.exports.parse = parseData;
module.exports.writeData = writeData;