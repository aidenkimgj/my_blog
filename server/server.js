import app from './app.js';

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}/`);
});
