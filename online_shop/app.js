let express = require('express');
let router = require('./routes/index.js');
let bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');

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

/*
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


function isLoggedIn(req, res, next) {
  console.log(req.user);
  console.log('auth?', req.isAuthenticated())
  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the home page
  return res.status(401).send({
    success: 'false',
    message: 'Unauthenticated',
  });
}
*/


app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

module.exports = app;
