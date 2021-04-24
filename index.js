const express = require('express')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors')
const ObjectID = require('mongodb').ObjectID

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.11ltg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

const port = 5000

console.log(process.env.DB_USER);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT ||  port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


client.connect(err => {
  const booksCollection = client.db("smart-bookshop").collection("books");
  const orderCollection = client.db("smart-bookshop").collection("orders");

  app.post('/addBook', (req,res)=>{
      const product = req.body;
      booksCollection.insertOne(product)
      .then(result =>{
           console.log('sucess data')
           res.redirect('/')
      })
  })
  
  app.post('/checkout', (req,res)=>{
    const product = req.body;
    orderCollection.insertOne(product)
    .then(result =>{
         console.log('sucess data')
         res.redirect('/')
    })
})
  app.delete('/delete/:id', (req,res)=>{
    console.log(req.params.id)
    booksCollection.deleteOne({_id : ObjectID(req.params.id)})
    .then((result)=>{
        console.log(result);
    })
})

  app.get('/books',(req,res)=>{
    booksCollection.find({})
    .toArray((err,documents)=>{
      // console.log(documents)
      res.send(documents)
      
    })
  })
  
  app.get('/orders',(req,res)=>{
    console.log(req.query.email)
    orderCollection.find({email : req.query.email})
    .toArray((err,documents)=>{
      // console.log(documents)
      res.send(documents)
      
    })
  })
 
});


