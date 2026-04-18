import express from 'express';





const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to the AWS Docker Backend!');
});

app.get('/health/check', (req, res) => {
  res.send('The server is healthy!');
});

export default app;
