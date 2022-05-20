const dotenv = require('dotenv');
dotenv.config();
import app from './app/app';

const PORT: string | number | any = process.env.PORT_SERVER || 5000;
const HOST: string = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Running API on port : ${PORT}`);
});
