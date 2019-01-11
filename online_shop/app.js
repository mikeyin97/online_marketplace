let express = require('express');
let router = require('./routes/index.js');
let bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

app.use(session({
  secret: 'testing',
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport); 

const PORT = 9999;

app.post('/login', passport.authenticate('local-login'),function(req, res){
  console.log("logged in");
  return res.status(200).send({
    success: 'false',
    message: 'logged in',
  });
}
);

app.get('/profile', isLoggedIn, function(req, res) {
  console.log('user', req.user);
});

app.get("/", (req, res) => res.json({message: "Welcome to the Marketplace!"}));

function isLoggedIn(req, res, next) {
  console.log(req.user);
  console.log('auth?', req.isAuthenticated())
  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}



app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

module.exports = app;
