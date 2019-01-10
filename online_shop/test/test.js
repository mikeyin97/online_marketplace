var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var conn = MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true });
