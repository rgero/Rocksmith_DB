# Rocksmith DLC API
----

The purpose of this API is to allow a user to quickly search for information related to the DLC for Rocksmith 2014 Remastered. This project is not affiliated with Ubisoft or anyone like that, and is currently meant to be a tool for learning.

Ideas for Potential improvements
    - Store the packs that the songs are stored with?
    - Add an integrity check for the database?

----

Steps for starting
    - Start MongoDB (the command for this is `mongod --dbpath .\mongo_database`)
    - Run command `node src\RocksmithManager.js'

To Do
    - Figure out if there's a way to specify the config for the `npm start` stuff.
    - Finish the tests
