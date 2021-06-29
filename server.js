const express = require('express');
const path = require ('path');
const app = express();
const Rollbar = require("rollbar");
const rollbar = new Rollbar({
  accessToken: '08fba530c8264ccc8aa22af373fdc2cd',
  captureUncaught: true,
  captureUnhandledRejections: true
});






app.use(express.json())


app.get('/', function(req, res) {
    rollbar.log('Hello World')
    res.sendFile(path.join(__dirname, '/client/index.html'))
})

app.get('/crash', (req, res) => {
    res.crashRollbar()
})




const port = process.env.PORT || 5050;
app.use(rollbar.errorHandler())
app.listen(port, function() {
    console.log(`Server livin on ${port}`)
})