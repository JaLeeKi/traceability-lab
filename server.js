const express = require('express');
const path = require ('path');
const app = express();
const Rollbar = require('rollbar');







app.use(express.json())


app.get('/', function(req, res) {
    Rollbar.log('Hello World')
    res.sendFile(path.join(__dirname, '/public/index.html'))
})






const port = process.env.PORT || 5050;

app.listen(port, function() {
    console.log(`Server livin on ${port}`)
})