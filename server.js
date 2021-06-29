const express = require('express');
const path = require ('path');
const app = express();
const Rollbar = require("rollbar");
const rollbar = new Rollbar({
  accessToken: '08fba530c8264ccc8aa22af373fdc2cd',
  captureUncaught: true,
  captureUnhandledRejections: true
});


let movies = [] // we'll hold any students added here

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'))
    rollbar.info('html file served successfully')
})

app.post('/api/movies', (req, res) => {
    let {title} = req.body
    title = title.trim()

    const index = movies.findIndex((movieTitle) => { // check if movie exists already
        return movieTitle === title
    })

    console.log(index)

    try { // using a "try catch" block will handle any generic 500 errors (not necessary, but a good addition)
        if (index === -1 && title !== '') {
            // we'll send responses to the user based upon whether or not they gave us a valid user to add
            // also we'll send information to rollbar so we can keep track of the activity that's happening
            movies.push(title)
            rollbar.log('movie added successfully', {author: 'jade', type: 'manual'})
            res.status(200).send(movies)
        } else if (title === '') {
            rollbar.error('no title given')
            res.status(400).send('must provide a title')
        } else {
            rollbar.error('movie already exists')
            res.status(400).send('that movie already exists on this list')
        }
    } catch (err) {
        rollbar.error(err)
    }
})




app.use(express.json())


// app.get('/', function(req, res) {
//     rollbar.log('Hello World');
//     rollbar.info('html file served successfully');
//     res.sendFile(path.join(__dirname, '/client/index.html'));
// })

// app.get('/crash', (req, res) => {
//     res.crashRollbar()
// })

// app.get('/error', (req, res) => {
//     rollbar.error('User tried to access incorrect path')
// })

// app.get('/critical', (req, res) => {
//     rollbar.critical("Crash while processing payment")
// })

// app.get('/warning', (req, res) => {
//     rollbar.warning("API unavailable")
// })




const port = process.env.PORT || 5050;
app.use(rollbar.errorHandler())
app.listen(port, function() {
    console.log(`Server livin on ${port}`)
})