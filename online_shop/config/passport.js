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
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, username, password, done) {
        conn.then(client=> client.findOne(
            {username: username},
            function(err, user){
            if (err)
            return done(err);

            if (!user)
                return done(null, false); 

            if (user.password !== password)
                return done(null, false); 
            
            return done(null, user);
        }));

    }));

    passport.use('local-signup', new Strategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, username, password, done) {
        process.nextTick(function() {
            conn.then(client=> client.findOne(
                {username: username},
                function(err, user){
                    if (err)
                    return done(err);

                    if (user) {
                        return done(null, false, {
                            "Success": "false",
                            "Response": "ERROR: Email is already in use"});
                    } else {

                    user = {
                        username: username,
                        password: password
                    };
                    conn.then(client=> client.insertOne(user, (function(err, docs) {
                        return done(null, user, {
                            "Success": "true",
                            "Response": "Signed Up"});
                    })));
                }
            }));
        });
    }));
};
