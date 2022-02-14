const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
require('express-async-errors');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const gameRouter = require('./routes/game');
const roomRouter = require('./routes/room');
const config = require('./config');
const { ERROR } = require('./constants');
const { connectDB } = require('./database/database');
const { initSocket } = require('./connection/socket');

connectDB();

const app = express();

app.use(morgan('tiny'));
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: config.cors.allowOrigin,
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

  console.error(err);
  res.status(err.status || 500).send(message);
});

const server = app.listen(config.port);
initSocket(server);
