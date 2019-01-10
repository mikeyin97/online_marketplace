let express = require('express');
let router = require('./routes/index.js');
let bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

app.get("/", (req, res) => res.json({message: "Welcome to the Marketplace!"}));

const PORT = 9999;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

module.exports = app;
