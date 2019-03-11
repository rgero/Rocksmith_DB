const mongoose = require('mongoose');
const CSVParser = require('./csv');
const {Song, checkExistence} = require('./models/Song');
const RocksmithRoutes = require('./routes/Rocksmith');
const express = require('express');
const app = express();

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
    app.use(express.json());
    app.use('/api/rocksmith', RocksmithRoutes);

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server Started - Listening on port ${port}...`));
}

// This is the connection statement, it returns a Promise
mongoose.connect('mongodb://localhost/Rocksmith')
    .then( startUp() )
    .catch( error => console.error('Could not connect: ', error));

