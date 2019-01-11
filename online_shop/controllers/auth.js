/*var MongoClient = require('mongodb').MongoClient;
var collectionName = 'users';

if (process.env.NODE_ENV === 'test'){
  collectionName = 'usersTest'
};

var conn = MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }).then(client => 
  client.db('local').collection(collectionName)
);
  

class AuthController {

    Login(req, res){
        console.log("logged in");
        return res.status(200).send({
          success: 'false',
          message: 'logged in',
        });
    };

    Profile(req, res){
        return res.status(200).send({
            success: 'false',
            message: req.user,
        });
    }
      
}

const authController = new AuthController();
module.exports = authController;*/