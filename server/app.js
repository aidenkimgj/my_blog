import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './config';
import hpp from 'hpp';
import helmet from 'helmet';
import morgan from 'morgan';

// Routes
import postsRoutes from './routes/api/post';

const app = express();
const { MONGO_URI } = config;

app.use(hpp());
app.use(helmet());

app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));

// 라우터를 쓸때 파싱을 하기위해 bodyParser를 사용해야 하지만 express에 내장되어 있는것을 사용할 수 있음 json형태로 브라우저에서 보내면 express 서버에서 json 형태로 해석해 달라는 이야기
app.use(express.json());
// app.use(bodyParser.json());  이거는 옛날 방식

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB connected!'))
  .catch(err => {
    throw err;
  });

// Use routes
app.get('/', (req, res) => {
  res.send('HI');
});

app.use('/api/post', postsRoutes);

export default app;
