const dotenv = require('dotenv');
dotenv.config();
import app from './app/app';
import http from 'http';

const PORT: string | number = process.env.PORT || 5000;
const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
  console.log(`Api on port : ${PORT}`);
});
