
const RocksmithRoutes = require('./routes/Rocksmith');
const express = require('express');
const app = express();


require('./startup/middleware')(app);
require('./startup/db')();

app.use('/api', RocksmithRoutes);

const port = process.env.PORT || 8000;
const server = app.listen(port, () => console.log(`Server Started - Listening on port ${port}...`));

module.exports = server;