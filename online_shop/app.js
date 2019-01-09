import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index.js';


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);
const PORT = 9999;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});


