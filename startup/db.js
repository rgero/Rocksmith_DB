const mongoose = require('mongoose');
const config = require('config');
const {Song, checkExistence} = require('../models/Song');
const CSVParser = require('../csv');

function populateData(){
    // The CSV file is the master list. This is parsed from another site.
    var songList = CSVParser.parse('Rocksmith.csv');
    songList.forEach( async (song) => {
        const newSong = new Song( {...song} );
        await newSong.save();
    })
    console.log("Database Populated");
}

async function startUp(){
    // Checks to see if the database has data, if it does we don't need to parse the CSV file.
    // TODO: Maybe store the date the database was populated, and if the CSV file is newer, do a deeper check to see if there is new data?
    if (process.env.NODE_ENV !== "test"){
        var startupData = false;
        startupData = await checkExistence();
        if (startupData == false) {
            console.log("Initial Start-up, parsing library")
            populateData();
        } else {
            console.log("Previous Data Exists, no need to parse CSV input")
        }
    }
}

module.exports = function() {
  const db = config.get('db');
  var username = config.get('username');
  var password = config.get('password');  
  mongoose.connect(db, {useNewUrlParser:true })
    .then(startUp());
}