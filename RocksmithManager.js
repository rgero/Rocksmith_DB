const mongoose = require('mongoose');
const CSVParser = require('./csv');
const {Song, checkExistence} = require('./SongModel');

function populateData(){
    var songList = CSVParser.parse('Rocksmith.csv');
    songList.forEach( async (song) => {
        const newSong = new Song( {...song} );
        await newSong.save();
    })
}

async function startUp(){
    var startupData = false;
    startupData = await checkExistence();
    if (startupData == false) {
        console.log("Initial Start-up, parsing library")
        populateData()
    } else {
        console.log("Previous Data Exists, no need to parse CSV input")
    }
    console.log("SUCCESSFUL CONNECTION TO DATABASE")
}

// This is the connection statement, it returns a Promise
mongoose.connect('mongodb://localhost/Rocksmith')
    .then( startUp() )
    .catch( error => console.error('Could not connect: ', error));