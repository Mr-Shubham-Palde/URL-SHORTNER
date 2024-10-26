const express = require("express");//it  simplifies handling HTTP requests and responses.
const mongoose = require("mongoose");//it is used to describe the schema for the mongodb
const ShortUrl = require('./models/shortUrl');
const app = express();

mongoose.connect('mongodb+srv://gofood:shubham123@cluster0.r6udd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));


//Sets EJS as the templating engine for the Express app, enabling it to render .ejs files as HTML with dynamic data.
app.set("view engine", "ejs");


app.use(express.urlencoded({ extended: false }));

// Serve static files like custom CSS
app.use(express.static('public'));


// get method is used for retrieving the data from the database, here It fetches all short URLs from the database and renders the index.ejs template, passing shortUrls data to it.
app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render('index', { shortUrls: shortUrls });
});


// Route for the info page
app.get('/info', (req, res) => {
  res.render('info'); // Render the info.ejs page
});


//post method is ued for sending the data to the databse. here Defines a POST route for /shortUrls that creates a new ShortUrl document using the full URL provided in req.body.fullUrl. After creating it, the user is redirected to the homepage.
app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect('/');
});

// it is used to delete the the url from the database
app.post('/delete/:id', async (req, res) => {
  await ShortUrl.findByIdAndDelete(req.params.id);
  res.redirect('/');
});


//if the url does not get generated then it will show the error but maximum time it does not shows the error
app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

//it is used to display our website on port 5000 we can also change the port number to display it on url
app.listen(process.env.PORT || 5000);
