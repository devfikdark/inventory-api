import figlet from 'figlet';
import './src/config/ImportEnv';
import './src/config/DbConfig';
import app from './src/app';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(figlet.textSync('Inventory-API-v1', {
    horizontalLayout: 'full',
  }));

  console.log(`Magic run on ${port} ${process.env.NODE_ENV === 'development' ? process.env.NODE_ENV: 'Prod'}`);
});
