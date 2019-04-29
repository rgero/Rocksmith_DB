const {Song, checkExistence} = require('../../models/Song');
let server;

describe("Test for checkExistence", ()=> {

    beforeEach( async ()=> {
        server = require('../../RocksmithManager');
        rocksmithKey = "sillygoose";
        songDic = {
            artist: "Roy G",
            name: "Song Awesome",
            leadTuning: "E Standard",
            rhythmTuning: "G Standard",
            bassTuning: "Drop D"
        };
        const newSong = new Song(songDic);
        newSong.save();
    })
    afterEach(async () => { 
        await Song.deleteMany({});
        await server.close(); 
    });

    test("Database doesn't exist, should return false", async ()=> {
        await Song.deleteMany({});
        var result = await checkExistence();
        expect(result).toBe(false);
    })

    test("Database exist, should return true", async ()=> {
        var result = await checkExistence();
        expect(result).toBe(true);
    })
})