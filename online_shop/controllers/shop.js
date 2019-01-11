var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var collectionName = 'shop';

if (process.env.NODE_ENV === 'test'){
  collectionName = 'shopTest'
};

var conn= MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }).then(client => 
  client.db('local').collection(collectionName)
);

class ShopController {

  AddItem(req, res){

    // checking the validity of the input
    if (!req.body.title) {
      return res.status(400).send({
        success: 'false',
        message: 'A title is required',
      });
    } else if (!req.body.price) {
      return res.status(400).send({
        success: 'false',
        message: 'A price is required',
      });
    } else if (!req.body.inventory) {
      return res.status(400).send({
        success: 'false',
        message: 'An inventory is required',
      });
    }

    // if id is passed in, set it to the id variable
    var id = null;
    if (req.body.id) {
      try {
        id = ObjectId(req.body.id);
      } catch(err) {
        return res.status(400).send({
          success: 'false',
          message: 'Not a valid id',
        });
      }
    }

    var newItem;
    if (id){
      newItem = { _id: id,
        title: req.body.title,
        price: parseFloat(req.body.price),
        inventory: parseInt(req.body.inventory),
      };
    } else {
      newItem = { title: req.body.title,
        price: parseFloat(req.body.price),
        inventory: parseInt(req.body.inventory),
      };
    }

    conn.then(client=> client.insertOne(newItem, (function(err, docs) {
      if(err) {
        console.error(err);
        return res.status(400).send({
          success: 'false',
          message: 'An error occurred',
        });
      } else {
        return res.status(201).send({
          success: 'true',
          message: 'Item created successfully',
          item: newItem,
        });
      }
    })));
  }

  IncrementItemInventoryById(req, res){

    // checking if the id is passed in and is valid
    var id = null;
    if (!req.body.id) {
      return res.status(400).send({
        success: 'false',
        message: 'An id is required',
      });
    }
    try {
      if (req.body.id) {
        id = ObjectId(req.body.id);
      }
    } catch(err) {
      return res.status(400).send({
        success: 'false',
        message: 'Not a valid id',
      });
    }

    var increment = 1;
    if (req.body.increment){
      increment = parseInt(req.body.increment);
    }
    conn.then(client=> client.findOneAndUpdate(
      {_id: id},
      {
        $inc: {inventory: increment},
      },
      function(err, item){
        if(err) {
          console.error(err);
          return res.status(400).send({
            success: 'false',
            message: 'An error occurred',
          });
        } else if (!item.value){
          return res.status(400).send({
            success: 'false',
            message: 'Item was not found',
          });
        } else {
          return res.status(200).send({
            success: 'true',
            message: 'Item inventory incremented successfully',
          });
        }
      }
    ));
  }

  IncrementItemInventoryByTitleAndPrice(req, res){

    // checking if title and price are both passed as body params
    if (!req.body.title) {
      return res.status(400).send({
        success: 'false',
        message: 'A title is required',
      });
    } else if (!req.body.price) {
      return res.status(400).send({
        success: 'false',
        message: 'A price is required',
      });
    }

    var increment = 1;
    if (req.body.increment){
      increment = parseInt(req.body.increment);
    }
    conn.then(client=> client.findOneAndUpdate(
      {title: req.body.title, price: parseFloat(req.body.price) },
      {
        $inc: {inventory: increment},
      },
      function(err, item){
        if(err) {
          console.error(err);
          return res.status(400).send({
            success: 'false',
            message: 'An error occurred',
          });
        } else if (!item.value){
          return res.status(400).send({
            success: 'false',
            message: 'Item was not found',
          });
        } else {
          return res.status(200).send({
            success: 'true',
            message: 'Item inventory incremented successfully',
          });
        }
      }
    ));
  }

  UpsertItemByTitleAndPrice(req, res){

    // checking if both title and price are passed as body params
    if (!req.body.title) {
      return res.status(400).send({
        success: 'false',
        message: 'A title is required',
      });
    } else if (!req.body.price) {
      return res.status(400).send({
        success: 'false',
        message: 'A price is required',
      });
    }

    var increment = 1;
    if (req.body.increment){
      increment = parseInt(req.body.increment);
    }
    if (increment < 0){
      return res.status(400).send({
        success: 'false',
        message: 'Increment must be non-negative',
      });
    }
    conn.then(client=> client.findOne(
      {title: req.body.title, price: parseFloat(req.body.price)},
      function(err, item){
        if(err) {
          console.error(err);
          return res.status(400).send({
            success: 'false',
            message: 'An error occurred',
          });
        } else {
          if (!item) {
            // if the item does not currently exist, create and insert one of it
            const newItem = { title: req.body.title,
              price: parseFloat(req.body.price),
              inventory: increment,
            };
            conn.then(client=> client.insertOne(newItem, (function(err, docs) {
              if(err) {
                console.error(err);
                return res.status(400).send({
                  success: 'false',
                  message: 'An error occurred',
                });
              } else {
                return res.status(201).send({
                  success: 'true',
                  message: 'Item created successfully',
                });
              }
            })));
          } else {
            // update the inventory of the existing item by 1
            conn.then(client=> client.updateOne(
              {title: req.body.title, price: parseFloat(req.body.price) },
              {
                $inc: {inventory: increment},
              },
              function(err, docs){
                if(err) {
                  console.error(err);
                  return res.status(400).send({
                    success: 'false',
                    message: 'An error occurred',
                  });
                } else {
                  return res.status(201).send({
                    success: 'true',
                    message: 'Item inventory incremented successfully',
                  });
                }
              }));
          }
        }
      }
    ));
  }

  DeleteItemById(req, res){

    // checking if the id is passed in and is valid
    var id = null;
    if (!req.body.id) {
      return res.status(400).send({
        success: 'false',
        message: 'An id is required',
      });
    }
    try {
      if (req.body.id) {
        id = ObjectId(req.body.id);
      }
    } catch(err) {
      return res.status(400).send({
        success: 'false',
        message: 'Not a valid id',
      });
    }

    conn.then(client=> client.deleteOne(
      {_id: id},
      function(err, item){
        if(err) {
          return res.status(400).send({
            success: 'false',
            message: 'An error occurred',
          });
        } else if (item.deletedCount === 0){
          return res.status(400).send({
            success: 'false',
            message: 'Item was not found',
          });
        } else {
          return res.status(200).send({
            success: 'true',
            message: 'Item deleted successfully',
          });
        }
      }
    ));
  }

  DeleteItemByTitleAndPrice(req, res){

    // check if both a title and price are passed in the body params
    if (!req.body.title) {
      return res.status(400).send({
        success: 'false',
        message: 'A title is required',
      });
    } else if (!req.body.price) {
      return res.status(400).send({
        success: 'false',
        message: 'A price is required',
      });
    }

    conn.then(client=> client.deleteOne(
      {title: req.body.title, price: parseFloat(req.body.price)},
      function(err, item){
        if(err) {
          console.error(err);
          return res.status(400).send({
            success: 'false',
            message: 'An error occurred',
          });
        } else if (item.deletedCount === 0){
          return res.status(400).send({
            success: 'false',
            message: 'Item was not found',
          });
        } else {
          return res.status(200).send({
            success: 'true',
            message: 'Item deleted successfully',
          });
        }
      }
    ));
  }

  DecrementItemInventoryById(req, res){

    // checking if the id is passed in and is valid
    var id = null;
    if (!req.body.id) {
      return res.status(400).send({
        success: 'false',
        message: 'An id is required',
      });
    }
    try {
      if (req.body.id) {
        id = ObjectId(req.body.id);
      }
    } catch(err) {
      return res.status(400).send({
        success: 'false',
        message: 'Not a valid id',
      });
    }

    var decrement = -1;
    if (req.body.decrement){
      decrement = parseInt(req.body.decrement)*-1;
    }
    conn.then(client=> client.findOneAndUpdate(
      {_id: ObjectId(id), inventory: {$gte:decrement*-1}}, //the inventory must be greater than the decrement amount
      {
        $inc: {inventory: decrement},
      },
      function(err, item){
        if(err) {
          console.error(err);
          return res.status(400).send({
            success: 'false',
            message: 'An error occurred',
          });
        } else if (!item.value){
          return res.status(400).send({
            success: 'false',
            message: 'Item was not found / had insufficient inventory',
          });
        } else {
          return res.status(200).send({
            success: 'true',
            message: 'Item inventory decremented successfully',
          });
        }
      }
    ));
  }

  DecrementItemInventoryByTitleAndPrice(req, res){

    // check if both a title and price are passed in the body params
    if (!req.body.title) {
      return res.status(400).send({
        success: 'false',
        message: 'A title is required',
      });
    } else if (!req.body.price) {
      return res.status(400).send({
        success: 'false',
        message: 'A price is required',
      });
    }
    var decrement = -1;
    if (req.body.decrement){
      decrement = parseInt(req.body.decrement)*-1;
    }

    conn.then(client=> client.findOneAndUpdate(
      {title: req.body.title, price: parseFloat(req.body.price), inventory: {$gte:1}},
      {
        $inc: {inventory: decrement},
      },
      function(err, item){
        if(err) {
          console.error(err);
          return res.status(400).send({
            success: 'false',
            message: 'An error occurred',
          });
        } else if (!item.value){
          return res.status(400).send({
            success: 'false',
            message: 'Item was not found / had no inventory',
          });
        } else {
          return res.status(200).send({
            success: 'true',
            message: 'Item inventory decremented successfully',
          });
        }
      }
    ));
  }

  GetItems(req, res){

    // clean up input query parameters
    var id = null;
    var title = null;
    var available = false;
    var lowerprice = null;
    var upperprice = null;
    try {
      if (req.query.id) {
        id = ObjectId(req.query.id);
      }
      if (req.query.title) {
        title = req.query.title;
      }
      if (req.query.available) {
        if (req.query.available !== "true" && req.query.available !== "false"){
          throw new Error("Available is not a boolean");
        }
        available = Boolean(req.query.available);
      }
      if (req.query.lowerprice) {
        lowerprice = parseFloat(req.query.lowerprice);
        if (isNaN(lowerprice)){
          throw new Error("Lowerprice is not a number");
        }
      }
      if (req.query.upperprice) {
        upperprice = parseFloat(req.query.upperprice);
        if (isNaN(upperprice)){
          throw new Error("Upperprice is not a number");
        }
      }
    } catch(err) {
      return res.status(400).send({
        success: 'false',
        message: 'Invalid parameters',
      });
    }

    // build the mongo query
    var query = {};
    if (id) { query._id = id; }
    if (title) { query.title = title; }
    if (available) { query.inventory = { $gt: 0 }; }
    if (lowerprice & upperprice) {
      query.price = { $gte: lowerprice, $lte: upperprice };
    } else if (lowerprice) {
      query.price = { $lte: lowerprice };
    } else if (upperprice) {
      query.price = { $lte: upperprice };
    }

    conn.then(client=> client.find(query).toArray(function(err, docs) {
      if(err) { console.error(err); }
      var response = {};
      response.items = docs;
      response.count = docs.length;
      return res.status(200).send({
        success: 'true',
        response: response,
      });
    }));
  }

  AmountGtInventory(req, res){

    // checking if the id and amount are passed in and are valid
    var id = null;
    var amount = null;
    if (!req.body.id) {
      return res.status(400).send({
        success: 'false',
        message: 'An id is required',
      });
    }
    try {
      if (req.body.id) {
        id = ObjectId(req.body.id);
      }
    } catch(err) {
      return res.status(400).send({
        success: 'false',
        message: 'Not a valid id',
      });
    }
    if (!req.body.amount) {
      return res.status(400).send({
        success: 'false',
        message: 'An amount is required',
      });
    }
    try {
      if (req.body.amount) {
        amount = parseInt(req.body.amount);
      }
      if (isNaN(amount)){
        throw new Error("Amount is not a number");
      }
    } catch(err) {
      return res.status(400).send({
        success: 'false',
        message: 'Not a valid amount',
      });
    }

    var queryId = ObjectId(req.body.id);
    conn.then(client=> client.findOne(
      {_id: ObjectId(queryId)},
      function(err, item){
        if(err) {
          console.error(err);
          return res.status(400).send({
            success: 'false',
            message: 'An error occurred',
          });
        } else if (!item){
          return res.status(400).send({
            success: 'false',
            message: 'Item was not found',
          });
        } else {
          var response = false;
          if (amount > item.inventory) {
            response = true;
          }
          return res.status(200).send({
            success: 'true',
            response: response,
          });
        }
      }
    ));
  }

}

const shopController = new ShopController();
module.exports = shopController;