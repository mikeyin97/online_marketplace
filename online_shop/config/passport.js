var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var Strategy = require('passport-local').Strategy;
var collectionName = 'users';
if (process.env.NODE_ENV === 'test'){
    collectionName = 'usersTest'
};


var conn = MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }).then(client => 
  client.db('local').collection(collectionName)
);

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        conn.then(client=> client.findOne(
            {_id: ObjectId(id)},
            function(err, user){
                done(err, user);
            }
        ));
    });

    passport.use('local-login', new Strategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
        console.log("username", username, password);
        // asynchronous
        // User.findOne wont fire unless data is sent back
        conn.then(client=> client.findOne(
            {username: username},
            function(err, user){
            console.log(user);
                // if there are any errors, return the error
            // if there are any errors, return the error before anything else
            if (err)
            return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (user.password !== password)
                return done(null, false); // create the loginMessage and save it to session as flashdata
            
            // all is well, return successful user
            console.log("HI");
            return done(null, user);
        }));

    }));
};
