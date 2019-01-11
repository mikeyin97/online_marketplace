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
        it('ERROR: it should return an error (invalid price)', (done) => {
            chai.request(server)
                .get('/api/getItems?lowerprice=ef')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql('false');
                    res.body.message.should.eql('Invalid parameters');
                    done();
                });
            });
        it('ERROR: it should return an error (invalid availability)', (done) => {
            chai.request(server)
                .get('/api/getItems?available=na')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.eql('false');
                    res.body.message.should.eql('Invalid parameters');
                    done();
                });
            });
        it('ERROR: it should return an error (invalid id)', (done) => {
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
        it('ERROR: it should return an error (item not found)', (done) => {
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
        it('ERROR: it should return an error (id required)', (done) => {
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
        it('ERROR: it should return an error (not a valid id)', (done) => {
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
        it('it should POST to increment item inventory', (done) => {
            let query = {
                title: 'banana',
                price: 3.4,
                increment: 10,
            }
            chai.request(server)
            .post('/api/incrementItemByTitleAndPrice')
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
        it('ERROR: it should return an error (price required)', (done) => {
            let query = {
                title: 'banana',
            }
            chai.request(server)
            .post('/api/incrementItemByTitleAndPrice')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('A price is required');
            done();
            });
        });
        it('ERROR: it should return an error (title required)', (done) => {
            let query = {
                price: 10,
            }
            chai.request(server)
            .post('/api/incrementItemByTitleAndPrice')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('A title is required');
            done();
            });
        }); 
        it('ERROR: it should return an error (item not found)', (done) => {
            let query = {
                title: "money",
                price: 10000
            }
            chai.request(server)
            .post('/api/incrementItemByTitleAndPrice')
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
    });
    describe('/POST /upsertItemByTitleAndPrice', () => {
        it('it should POST to upsert the item inventory (existing item)', (done) => {
            let query = {
                title: 'banana',
                price: 3.4,
                increment: 10,
            }
            chai.request(server)
            .post('/api/upsertItemByTitleAndPrice')
            .send(query)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.success.should.eql('true');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Item inventory incremented successfully');
            done();
            });
        }); 
        it('it should POST to upsert the item inventory (new item)', (done) => {
            let query = {
                title: 'banana',
                price: 4.0,
            }
            chai.request(server)
            .post('/api/upsertItemByTitleAndPrice')
            .send(query)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.success.should.eql('true');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Item created successfully');
            done();
            });
        }); 
        it('ERROR: it should return an error (price required)', (done) => {
            let query = {
                title: 'banana',
            }
            chai.request(server)
            .post('/api/upsertItemByTitleAndPrice')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('A price is required');
            done();
            });
        });
        it('ERROR: it should return an error (title required)', (done) => {
            let query = {
                price: 10,
            }
            chai.request(server)
            .post('/api/upsertItemByTitleAndPrice')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('A title is required');
            done();
            });
        }); 
        it('ERROR: it should return an error (increment cannot be negative)', (done) => {
            let query = {
                title: 'banana',
                price: 3.4,
                increment: -10,
            }
            chai.request(server)
            .post('/api/upsertItemByTitleAndPrice')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Increment must be non-negative');
            done();
            });
        });  
    });
    describe('/POST /decrementItemById', () => {
        it('it should POST to decrement item inventory', (done) => {
            let query = {
                id: "000000000000000000000002",
                decrement: 2,
            }
            chai.request(server)
            .post('/api/decrementItemById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.eql('true');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Item inventory decremented successfully');
            done();
            });
        }); 
        it('ERROR: it should return an error (insufficient inventory - decrements less than 0)', (done) => {
            let query = {
                id: "000000000000000000000001",
                decrement: 1,
            }
            chai.request(server)
            .post('/api/decrementItemById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.eql('true');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Item inventory decremented successfully');
            done();
            });
        }); 
        it('ERROR: it should return an error (item not found)', (done) => {
            let query = {
                id: "000000000000000000000010"
            }
            chai.request(server)
            .post('/api/decrementItemById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Item was not found / had insufficient inventory');
            done();
            });
        });
        it('ERROR: it should return an error (id required)', (done) => {
            let query = {
            }
            chai.request(server)
            .post('/api/decrementItemById')
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
        it('ERROR: it should return an error (not a valid id)', (done) => {
            let query = {
                id: "000000000000000000000"
            }
            chai.request(server)
            .post('/api/decrementItemById')
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
    describe('/POST /decrementItemByTitleAndPrice', () => {
        it('it should POST to decrement item inventory', (done) => {
            let query = {
                title: 'phone',
                price: 100.3,
                decrement: 20,
            }
            chai.request(server)
            .post('/api/decrementItemByTitleAndPrice')
            .send(query)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.eql('true');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Item inventory decremented successfully');
            done();
            });
        }); 
        it('ERROR: it should return an error (price required)', (done) => {
            let query = {
                title: 'banana',
            }
            chai.request(server)
            .post('/api/decrementItemByTitleAndPrice')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('A price is required');
            done();
            });
        });
        it('ERROR: it should return an error (title required)', (done) => {
            let query = {
                price: 10,
            }
            chai.request(server)
            .post('/api/decrementItemByTitleAndPrice')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('A title is required');
            done();
            });
        }); 
        it('ERROR: it should return an error (item not found)', (done) => {
            let query = {
                title: "money",
                price: 10000
            }
            chai.request(server)
            .post('/api/decrementItemByTitleAndPrice')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Item was not found / had no inventory');
            done();
            });
        });  
        it('ERROR: it should return an error (insufficient inventory)', (done) => {
            let query = {
                title: "banana",
                price: 3.4
            }
            chai.request(server)
            .post('/api/decrementItemByTitleAndPrice')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Item was not found / had no inventory');
            done();
            });
        });  
    });
    describe('/POST /api/deleteItemById', () => {
        it('it should POST to delete item inventory', (done) => {
            let query = {
                id: "000000000000000000000000"
            }
            chai.request(server)
            .post('/api/deleteItemById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.eql('true');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Item deleted successfully');
            done();
            });
        }); 
        it('ERROR: it should return an error (item not found)', (done) => {
            let query = {
                id: "000000000000000000000010"
            }
            chai.request(server)
            .post('/api/deleteItemById')
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
        it('ERROR: it should return an error (id required)', (done) => {
            let query = {
            }
            chai.request(server)
            .post('/api/deleteItemById')
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
        it('ERROR: it should return an error (not a valid id)', (done) => {
            let query = {
                id: "000000000000000000000"
            }
            chai.request(server)
            .post('/api/deleteItemById')
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
    describe('/POST /api/deleteItemByTitleAndPrice', () => {
        it('it should POST to delete item inventory', (done) => {
            let query = {
                title: 'banana',
                price: 3.4,
            }
            chai.request(server)
            .post('/api/deleteItemByTitleAndPrice')
            .send(query)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.eql('true');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Item deleted successfully');
            done();
            });
        }); 
        it('ERROR: it should return an error (price required)', (done) => {
            let query = {
                title: 'banana',
            }
            chai.request(server)
            .post('/api/deleteItemByTitleAndPrice')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('A price is required');
            done();
            });
        });
        it('ERROR: it should return an error (title required)', (done) => {
            let query = {
                price: 10,
            }
            chai.request(server)
            .post('/api/deleteItemByTitleAndPrice')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('A title is required');
            done();
            });
        }); 
        it('ERROR: it should return an error (item not found)', (done) => {
            let query = {
                title: "money",
                price: 10000
            }
            chai.request(server)
            .post('/api/deleteItemByTitleAndPrice')
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
    });
    describe('/POST /api/amountGtInventory', () => {
        it('it should POST and return true', (done) => {
            let query = {
                id: '000000000000000000000001',
                amount: 30,
            }
            chai.request(server)
            .post('/api/amountGtInventory')
            .send(query)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.eql('true');
                res.body.response.should.eql(true);
            done();
            });
        }); 
        it('it should POST and return false', (done) => {
            let query = {
                id: '000000000000000000000001',
                amount: 10,
            }
            chai.request(server)
            .post('/api/amountGtInventory')
            .send(query)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.eql('true');
                res.body.response.should.eql(false);
            done();
            });
        });
        it('ERROR: it should return an error (id required)', (done) => {
            let query = {
                amount: 10,
            }
            chai.request(server)
            .post('/api/amountGtInventory')
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
        it('ERROR: it should return an error (not a valid id)', (done) => {
            let query = {
                id: "000000000000000000000",
                amount:10,
            }
            chai.request(server)
            .post('/api/amountGtInventory')
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
        it('ERROR: it should return an error (amount required)', (done) => {
            let query = {
                id: '000000000000000000000001'
            }
            chai.request(server)
            .post('/api/amountGtInventory')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('An amount is required');
            done();
            });
        }); 
        it('ERROR: it should return an error (not a valid amount)', (done) => {
            let query = {
                id: '000000000000000000000001',
                amount:"EG",
            }
            chai.request(server)
            .post('/api/amountGtInventory')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Not a valid amount');
            done();
            });
        });  
    });
});

describe('Testing the cart', () => {
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
    describe('/GET /api/viewCart', () => {
        it('it should GET the cart', (done) => {
            chai.request(server)
                .get('/api/viewCart')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.success.should.eql('true');
                    res.body.current_cart.should.be.a('object');
                    res.body.current_cart.cart.should.be.a('object');
                    res.body.current_cart.cart.items.should.be.a('array');
                    res.body.current_cart.cart.price.should.be.a('number');
                    res.body.current_cart.count.should.be.a('number');
                    done();
                });
            }
        );
    });
    describe('/POST /api/addToCartById', () => {
        it('it should POST to add item to cart', (done) => {
            let query = {
                id: "000000000000000000000002",
                amount: 20,
            }
            chai.request(server)
            .post('/api/addToCartById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.eql('true');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Your cart has been updated');
                res.body.current_cart.should.be.a('object');
                res.body.current_cart.items.should.be.a('array');
                res.body.current_cart.price.should.be.a('number');
            done();
            });
        }); 
        it('it should POST to add item to cart with the default amount', (done) => {
            let query = {
                id: "000000000000000000000002",
            }
            chai.request(server)
            .post('/api/addToCartById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.eql('true');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Your cart has been updated');
                res.body.current_cart.should.be.a('object');
                res.body.current_cart.items.should.be.a('array');
                res.body.current_cart.price.should.be.a('number');
            done();
            });
        }); 
        it('it should POST to add new item to cart', (done) => {
            let query = {
                id: "000000000000000000000004",
                amount: 5,
            }
            chai.request(server)
            .post('/api/addToCartById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.eql('true');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Your cart has been updated');
                res.body.current_cart.should.be.a('object');
                res.body.current_cart.items.should.be.a('array');
                res.body.current_cart.price.should.be.a('number');
            done();
            });
        }); 
        it('ERROR: it should return an error (id required)', (done) => {
            let query = {
                amount: 2,
            }
            chai.request(server)
            .post('/api/addToCartById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('An id is required');
                res.body.current_cart.should.be.a('object');
                res.body.current_cart.items.should.be.a('array');
                res.body.current_cart.price.should.be.a('number');
            done();
            });
        }); 
        it('ERROR: it should return an error (invalid id)', (done) => {
            let query = {
                id: "123",
                amount: 2,
            }
            chai.request(server)
            .post('/api/addToCartById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Not a valid id');
                res.body.current_cart.should.be.a('object');
                res.body.current_cart.items.should.be.a('array');
                res.body.current_cart.price.should.be.a('number');
            done();
            });
        }); 
        it('ERROR: it should return an error (card amount would exceed inventory)', (done) => {
            let query = {
                id: "000000000000000000000002",
                amount: 10000,
            }
            chai.request(server)
            .post('/api/addToCartById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Your cart amount would exceed current inventory. The item has not been added.');
                res.body.current_cart.should.be.a('object');
                res.body.current_cart.items.should.be.a('array');
                res.body.current_cart.price.should.be.a('number');
            done();
            });
        }); 
        it('ERROR: it should return an error (item with this id nonexistant)', (done) => {
            let query = {
                id: "000000000000000000000009",
                amount: 100,
            }
            chai.request(server)
            .post('/api/addToCartById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Item with this ID does not exist');
            done();
            });
        }); 
    });
    describe('/POST /api/removeFromCartById', () => {
        it('it should POST to remove the item from cart (default amount)', (done) => {
            let query = {
                id: "000000000000000000000002",
            }
            chai.request(server)
            .post('/api/removeFromCartById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.eql('true');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Your cart has been updated.');
                res.body.current_cart.should.be.a('object');
                res.body.current_cart.items.should.be.a('array');
                res.body.current_cart.price.should.be.a('number');
            done();
            });
        }); 
        it('it should POST to remove the item from cart (default amount)', (done) => {
            let query = {
                id: "000000000000000000000002",
                amount: 2, 
            }
            chai.request(server)
            .post('/api/removeFromCartById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.eql('true');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Your cart has been updated.');
                res.body.current_cart.should.be.a('object');
                res.body.current_cart.items.should.be.a('array');
                res.body.current_cart.price.should.be.a('number');
            done();
            });
        }); 
        it('ERROR: it should return an error (item not in cart)', (done) => {
            let query = {
                id: "000000000000000000000003",
                amount: 10,
            }
            chai.request(server)
            .post('/api/removeFromCartById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('This item does not exist in your cart.');
                res.body.current_cart.should.be.a('object');
                res.body.current_cart.items.should.be.a('array');
                res.body.current_cart.price.should.be.a('number');
            done();
            });
        }); 
        it('ERROR: it should return an error (id required)', (done) => {
            let query = {
                id: "000000000000000000000004",
                amount: 10,
            }
            chai.request(server)
            .post('/api/removeFromCartById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('The cart cannot have an item with less than 0 count. No changes have been made');
                res.body.current_cart.should.be.a('object');
                res.body.current_cart.items.should.be.a('array');
                res.body.current_cart.price.should.be.a('number');
            done();
            });
        }); 
        it('ERROR: it should return an error (id required)', (done) => {
            let query = {
                amount: 2,
            }
            chai.request(server)
            .post('/api/removeFromCartById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('An id is required');
                res.body.current_cart.should.be.a('object');
                res.body.current_cart.items.should.be.a('array');
                res.body.current_cart.price.should.be.a('number');
            done();
            });
        }); 
        it('ERROR: it should return an error (invalid id)', (done) => {
            let query = {
                id: "123",
                amount: 2,
            }
            chai.request(server)
            .post('/api/removeFromCartById')
            .send(query)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.success.should.eql('false');
                res.body.message.should.be.a('string');
                res.body.message.should.eql('Not a valid id');
                res.body.current_cart.should.be.a('object');
                res.body.current_cart.items.should.be.a('array');
                res.body.current_cart.price.should.be.a('number');
            done();
            });
        }); 
    });
    describe('/POST /api/completeCartPurchase', () => {
        it('it should POST to complete the cart purchase', (done) => {
            let query = {
            }
            chai.request(server)
            .post('/api/completeCartPurchase')
            .send(query)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.eql('true');
                res.body.response.should.eql('Purchase completed');
                res.body.current_cart.should.be.a('Object');
                res.body.current_cart.items.should.be.a('array');
                res.body.current_cart.price.should.eql(0);
                res.body.purchase.items.should.be.a('array');
                res.body.purchase.price.should.be.a('number');
            done();
            });
        }); 
    });
    describe('/POST /api/emptyCart', () => {
        it('it should POST to empty the cart', (done) => {
            let query = {
            }
            chai.request(server)
            .post('/api/emptyCart')
            .send(query)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.eql('true');
                res.body.message.should.eql('Cart successfully emptied');
                res.body.current_cart.should.be.a('Object');
                res.body.current_cart.items.should.eql([]);
                res.body.current_cart.price.should.eql(0);
            done();
            });
        }); 
    });
    
    
});
