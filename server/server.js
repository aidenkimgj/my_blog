import app from './app.js';
import config from './config/index.js';
import path from 'path';
import greenlock from 'greenlock-express';

const { PORT } = config;

greenlock
  .init({
    packageRoot: path.join(__dirname, '../'),
    configDir: path.join(__dirname, '../', 'server/config/greenlock.d'),
    maintainerEmail: 'aidengookjinkim@gmail.com',
    cluster: false,
  })
  .serve(app, () => {
    console.log('greenlock work');
  });

// app.listen(PORT, () => {
//   console.log(`Server On : http://localhost:${PORT}/`);
// });
