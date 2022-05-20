const dotenv = require('dotenv');
dotenv.config();
import app from './app/app';
import cros from 'cors';

const PORT: string | number = process.env.PORT_SERVER || 5000;

app.use(cros());

app.listen(PORT, () => {
  console.log(`Running API on port : ${PORT}`);
});
