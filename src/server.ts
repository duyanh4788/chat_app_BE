const dotenv = require('dotenv');
dotenv.config();
import app from './app/app';

const PORT: string | number = process.env.PORT_SERVER || 5000;

app.listen(PORT, () => {
  console.log(`Running API on port : ${PORT}`);
});
