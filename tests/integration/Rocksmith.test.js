const request = require('supertest');
const {Song} = require('../../models/Song');

let server;
let song;
let songDic;
let rocksmithKey;
let inputParams;

describe("PUT tests for /", ()=> {

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
        inputParams = {
            key: rocksmithKey,
            songs: songDic
        }
    })
    afterEach(async () => { 
        await Song.deleteMany({});
        await server.close(); 
    });

    const executeRequest = async () => {
        return await request(server)
          .put('/api')
          .send(inputParams);
      }
  
    test("User doesn't supply authkey, should get 401", async ()=>{
        delete inputParams.key;
        let result = await executeRequest();
        expect(result.status).toBe(401);
    })

    test("User provides wrong key, should get 400", async ()=>{
        inputParams.key = "asidnasidnasidnas";
        let result = await executeRequest();

        expect(result.status).toBe(400);
    })

    test("User doesn't supply song, should get 400", async ()=>{
        delete inputParams.songs;
        let result = await executeRequest();
        expect(result.status).toBe(400);
    })

    test("User submits single song", async ()=> {
        var result = await executeRequest();
        expect(result.status).toBe(200);
    })

    test("User submits single song, check it is saved.", async ()=> {
        var result = await executeRequest();
        expect(result.status).toBe(200);

        var songInDB = Song.findOne(songDic);
        expect(songInDB).not.toBeNull();
    })

    test("User submits multiple song", async ()=> {
        inputParams.songs = [ songDic, songDic, songDic]
        var result = await executeRequest();
        expect(result.status).toBe(200);
    })

    test("User submits multiple song, check if saved", async ()=> {
        inputParams.songs = [ songDic, songDic, songDic]
        var result = await executeRequest();
        var songsInDB = Song.countDocuments(songDic);
        expect(songsInDB).not.toBeNull();
    })
})

// TODO
// Tests for GET
// Tests for Copy
