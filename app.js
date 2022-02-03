const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
require('express-async-errors');
const dotenv = require('dotenv');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const gameRouter = require('./routes/game');
const roomRouter = require('./routes/room');
const { ERROR } = require('./constants');

dotenv.config();

mongoose.connect(process.env.DB_HOST);

const app = express();

app.use(morgan('tiny'));
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ALLOW_ORIGIN,
  })
);

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/game', gameRouter);
app.use('/room', roomRouter);

app.use((req, res) => {
  res.status(404).send(ERROR.NOT_FOUND);
});

app.use((err, req, res, next) => {
  const message =
    req.app.get('env') === 'development' ? err.message : 'Server error';

  res.status(err.status || 500).send(message);
});

app.listen(8080);
