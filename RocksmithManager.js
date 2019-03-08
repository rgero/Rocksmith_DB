const mongoose = require('mongoose');
const CSVParser = require('./csv');
const {Song, checkExistence} = require('./SongModel');

function populateData(){
    var songList = CSVParser.parse('Rocksmith.csv');
    songList.forEach( async (song) => {
        const newSong = new Song( ...song );
        const result = await newSong.save();
    })

}


// This is the connection statement, it returns a Promise
mongoose.connect('mongodb://localhost/Rocksmith')
    .then(populateData())
    .catch( error => console.error('Could not connect: ', error));

// Test to see if there is _any_ data in the collection
let startupData = false;
startupData = checkExistence();
console.log("Startup Data - ", startupData);
console.log("Ddadda")

// Gets the song list
