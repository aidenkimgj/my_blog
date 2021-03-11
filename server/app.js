import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import mongoose from 'mongoose';
import hpp from 'hpp';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

// Routes
import postRoutes from './routes/api/post.js';
import userRoutes from './routes/api/user.js';
import authRoutes from './routes/api/auth.js';
import searchRoutes from './routes/api/search.js';

const app = express();
const { MONGO_URI } = config;

// NODE_ENV = production
const prod = process.env.NODE_ENV === 'production';

app.use(hpp());
// 브라우저가 데이타베이스에 접근 못하게 막는것을 막아준다
app.use(helmet({ contentSecurityPolicy: false }));

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

app.use('/api/post', postRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);

if (prod) {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

export default app;
