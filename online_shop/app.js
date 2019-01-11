let express = require('express');
let router = require('./routes/index.js');
let bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'testing',
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

require('./config/passport')(passport); 

const PORT = 9999;

app.get("/", (req, res) => res.json({message: "Welcome to the Marketplace!"}));

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

module.exports = app;
