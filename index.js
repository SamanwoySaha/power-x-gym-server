const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 5000;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dpnco.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

client.connect(err => {
  const classesCollection = client.db("powerGym").collection("classes");
  const pricingsCollection = client.db("powerGym").collection("pricings");
  const membershipsCollection = client.db("powerGym").collection("memberships");

  app.get('/classes', (req, res) => {
    classesCollection.find({})
      .toArray((err, documents) => {
        if (err) {
          res.status(404).send('Error');
        }
        else {
          res.send(documents);
        }
      })
  });

  app.get('/pricings', (req, res) => {
    pricingsCollection.find({})
      .toArray((err, documents) => {
        if (err) {
          res.status(404).send('Error');
        }
        else {
          res.send(documents);
        }
      })
  });

  app.post('/addMember', (req, res) => {
    membershipsCollection.insertOne(req.body)
    .then(result => {
      if(result.insertedCount > 0){
        res.send(result.insertedCount > 0);
      } else {
        res.status(404).send('Error');
      }
    })
  })
});

app.listen(port);