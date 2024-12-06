import './ImportEnv';
import mongoose from 'mongoose';

// cloud connection-Str
let cloudDB;

if (process.env.NODE_ENV === 'development') {
  cloudDB = process.env.DATABASE_DEV.replace(
    '<password>',
    process.env.DATABASE_PASSWORD_DEV,
  );
} else {
  cloudDB = process.env.DATABASE_PROD.replace(
    '<password>',
    process.env.DATABASE_PASSWORD_PROD,
  );
}

mongoose.connect(cloudDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}).then(() => {
  console.log('DB connect success :)');
}).catch(() => {
  console.log('Something problem to connect DB !!!');
});
