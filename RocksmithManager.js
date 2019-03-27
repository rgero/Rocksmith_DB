const mongoose = require('mongoose');
const CSVParser = require('./csv');
const {Song, checkExistence} = require('./models/Song');
const RocksmithRoutes = require('./routes/Rocksmith');
const express = require('express');
const app = express();
const cors = require('cors')

function populateData(){
    // The CSV file is the master list. This is parsed from another site.
    var songList = CSVParser.parse('Rocksmith.csv');
    songList.forEach( async (song) => {
        const newSong = new Song( {...song} );
        await newSong.save();
    })
}

async function startUp(){
    // Checks to see if the database has data, if it does we don't need to parse the CSV file.
    // TODO: Maybe store the date the database was populated, and if the CSV file is newer, do a deeper check to see if there is new data?
    var startupData = false;
    startupData = await checkExistence();
    if (startupData == false) {
        console.log("Initial Start-up, parsing library")
        populateData();
    } else {
        console.log("Previous Data Exists, no need to parse CSV input")
    }

    // The database should be populated by this point, start the application.
    app.use(express.json());
    app.use(cors());
    app.use('/api/rocksmith', RocksmithRoutes);
    const port = process.env.PORT || 8000;
    app.listen(port, () => console.log(`Server Started - Listening on port ${port}...`));
}

// START POINT - This connects to the database.
mongoose.connect('mongodb://localhost/Rocksmith')
    .then( startUp() )
    .catch( error => console.error('Could not connect: ', error));

