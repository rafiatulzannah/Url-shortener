const express = require('express');
const app= express();
const ShortUrl=require('./models/shortUrl');
const mongoose=require("mongoose");

const Connection = async () => {
    try {
      const url =
      "mongodb+srv://RafiaZannah:12345@cluster0.5g9y9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("database connected successfully");
    } catch (error) {
      console.log("Error while connecting to MongoDB", error);
    }
  };

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}));

app.get('/', async (req,res)=>{
  const shortUrls= await ShortUrl.find()  
  res.render('index', {shortUrls: shortUrls})
})

app.post('/shortUrls', async (req, res)=>{
  await ShortUrl.create({full: req.body.fullUrl});
  res.redirect('/');
})

app.get('/:shortUrl', async (req,res)=>{
  const shortUrl= await ShortUrl.findOne({ short: req.params.shortUrl})
  if(shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})
app.listen(process.env.PORT || 5000);

Connection();