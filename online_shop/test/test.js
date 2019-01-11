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
                "title": "banana",
                "price": parseFloat(3.40),
                "inventory": 0, 
                "_id": ObjectId("000000000000000000000000")
            },{
                "title": "phone",
                "price": parseFloat(100.30),
                "inventory": 20, 
                "_id": ObjectId("000000000000000000000001")
            },{
                "title": "pen",
                "price": parseFloat(0.99),
                "inventory": 500, 
                "_id": ObjectId("000000000000000000000002")
            },{
                "title": "hat",
                "price": parseFloat(3.50),
                "inventory": 2, 
                "_id": ObjectId("000000000000000000000003")
            },{
                "title": "banana",
                "price": parseFloat(2.30),
                "inventory": 100, 
                "_id": ObjectId("000000000000000000000004")
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
                    res.body.response.count.should.eql(5);
                    done();
                });
            });
        it('it should GET a specific item by id', (done) => {
            chai.request(server)
                .get('/api/getItems?id=000000000000000000000004')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.success.should.eql('true');
                    res.body.response.should.be.a('object');
                    res.body.response.items.should.be.a('array');
                    res.body.response.count.should.be.a('number');
                    res.body.response.count.should.eql(1);
                    done();
                });
            });
        it('it should GET items by title', (done) => {
            chai.request(server)
                .get('/api/getItems?title=banana')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.success.should.eql('true');
                    res.body.response.should.be.a('object');
                    res.body.response.items.should.be.a('array');
                    res.body.response.count.should.be.a('number');
                    res.body.response.count.should.eql(2);
                    done();
                });
            });
        it('it should GET only available items', (done) => {
            chai.request(server)
                .get('/api/getItems?available=true')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.success.should.eql('true');
                    res.body.response.should.be.a('object');
                    res.body.response.items.should.be.a('array');
                    res.body.response.count.should.be.a('number');
                    res.body.response.count.should.eql(4);
                    done();
                });
            });
        it('it should GET all the items in a price range', (done) => {
            chai.request(server)
                .get('/api/getItems?lowerprice=1&upperprice=5')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.success.should.eql('true');
                    res.body.response.should.be.a('object');
                    res.body.response.items.should.be.a('array');
                    res.body.response.count.should.be.a('number');
                    res.body.response.count.should.eql(3);
                    done();
                });
            });
        it('it should return a error (invalid price)', (done) => {
            chai.request(server)
                .get('/api/getItems?lowerprice=ef')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql('false');
                    res.body.message.should.eql('Invalid parameters');
                    done();
                });
            });
        it('it should return a error (invalid availability)', (done) => {
            chai.request(server)
                .get('/api/getItems?available=na')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql('false');
                    res.body.message.should.eql('Invalid parameters');
                    done();
                });
            });
        it('it should return a error (invalid id)', (done) => {
            chai.request(server)
                .get('/api/getItems?id=123')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql('false');
                    res.body.message.should.eql('Invalid parameters');
                    done();
                });
            });
    });
    describe('/POST /api/incrementItemById', () => {
        it('it should POST to increment item inventory', (done) => {
            let query = {
                id: "000000000000000000000002"
            }
            chai.request(server)
            .post('/api/incrementItemById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.eql('true');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Item inventory incremented successfully');
            done();
            });
        }); 
        it('it should return item not found', (done) => {
            let query = {
                id: "000000000000000000000010"
            }
            chai.request(server)
            .post('/api/incrementItemById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Item was not found');
            done();
            });
        });
        it('it should return id required', (done) => {
            let query = {
            }
            chai.request(server)
            .post('/api/incrementItemById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('An id is required');
            done();
            });
        }); 
        it('it should return item not found', (done) => {
            let query = {
                id: "000000000000000000000"
            }
            chai.request(server)
            .post('/api/incrementItemById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Not a valid id');
            done();
            });
        });  
    });
    describe('/POST /incrementItemByTitleAndPrice', () => {
    });
    describe('/POST /upsertItemByTitleAndPrice', () => {
    });
    describe('/POST /decrementItemById', () => {
    });
    describe('/POST /decrementItemByTitleAndPrice', () => {
    });
    describe('/POST /api/deleteItemById', () => {
    });
    describe('/POST /api/deleteItemByTitleAndPrice', () => {
    });
    describe('/POST /api/amountGtInventory', () => {
    });
    describe('/POST /api/viewCart', () => {
    });


});