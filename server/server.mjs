import 'dotenv/config';
import express from 'express';
import cors from 'cors';
const port = process.env.PORT || 8080;
const app = express();
app.use(cors());
app.use(express.json());

// log every request to the console
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

// --- Change nothing above this line ---


// Connect to MongoDB
import { MongoClient, ObjectId } from 'mongodb';
const client = new MongoClient('mongodb://localhost:27017');
const connection = await client.connect();
const db = connection.db("app") // equivalent to mongosh's use command to select a database

// Always have async in the code below
app.get('/api/produce.json', async (req, res) => {
  const produce = await db.collection('produce').find().toArray()
  // toArray() will turn the data into a JSON. otherwise no data will show up

  res.json(produce).status(200);
});

// Getting a single document
// app.get('/api/produce/67e40f237e0b2cde5e6b140c.json', async (req, res) => {
//   const banana = await db.collection('produce').findOne({
//     _id: new ObjectId("67e40f237e0b2cde5e6b140c")}) // When working with object ids, need to convert the id string into an Object type
//   res.json(banana).status(200)
// });

// Making the route work for any document
app.get('/api/produce/:id.json', async (req, res) => {
  const id = req.params.id
  const banana = await db.collection('produce').findOne({
    _id: new ObjectId(id)}) // When working with object ids, need to convert the id string into an Object type
  res.json(banana).status(200)
});

// --- Change nothing below this line ---

// 404 - not found
app.use((req, res, next) => {
  res.status(404).json({ message: 'resource ' + req.url + ' not found' });
});

// 500 - Any server error
app.use((err, req, res, next) => {
  res.status(500).json({ error: err });
});

// start server on port
app.listen(port, () => {
  console.log(`app listening on http://localhost:${port}/`);
});
