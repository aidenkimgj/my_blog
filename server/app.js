import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './config';

const app = express();
const { MONGO_URI } = config;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => console.log('MongoDB connected!'))
  .catch(err => {
    throw err;
  });

app.get('/', (req, res) => {
  res.send('HI');
});

export default app;
