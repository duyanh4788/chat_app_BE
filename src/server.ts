require('dotenv').config();
import app from './app/app';

const PORT: string | number = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Api on port : ${PORT}`);
});
