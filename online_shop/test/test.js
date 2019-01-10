process.env.NODE_ENV = 'test';

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;


if (process.env.NODE_ENV === 'test'){
    collectionName = 'shopTest'
};
var conn= MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }).then(client => 
  client.db('local').collection(collectionName)
);

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('Testing the shop', () => {
    beforeEach((done) => {
        conn.then(client=> client.deleteMany({}, (function(err) {
            // test data to test with
            var newItems = [{
                "title": "carrot",
                "price": 3.40,
                "inventory": 100, 
                "id": "000000000000000000000000"
            },{
                "title": "phone",
                "price": 100.30,
                "inventory": 20, 
                "id": "000000000000000000000001"
            },{
                "title": "pen",
                "price": 1.00,
                "inventory": 500, 
                "id": "000000000000000000000002"
            },{
                "title": "hat",
                "price": 3.50,
                "inventory": 2, 
                "id": "000000000000000000000003"
            },{
                "title": "banana",
                "price": 2.00,
                "inventory": 100, 
                "id": "000000000000000000000004"
            },
            ]
            conn.then(client=> client.insertMany(newItems, (function(err, docs) {
                done();
            })));     
        })));        
    });
  describe('/GET /api/getItems', () => {
      it('it should GET all the items', (done) => {
        chai.request(server)
            .get('/api/getItems')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.eql('true');
                res.body.response.should.be.a('object');
                res.body.response.items.should.be.a('array');
                res.body.response.count.should.be.a('number');
              done();
            });
      });
  });

});