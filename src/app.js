import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from './routers/router';
import GlobalErrorHandler from './utils/errors/GlobalErrorHandler';
import AppError from './utils/errors/AppError';

const app = express();

// parse application/json
app.use(express.json());

// access cors policy
app.use(cors());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// doc
app.get('/', (req, res) => {
  res.redirect('https://documenter.getpostman.com/view/9978541/Tz5s5wvY');
});

app.use(process.env.VERSION, router);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(GlobalErrorHandler);

export default app;
