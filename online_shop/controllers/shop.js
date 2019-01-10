var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var conn = MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true });

class ShopController {

  /*
  POST: Add an item to the mongo database. Used to build the testing database.
  Not used regularly.

  BODY:
  - title (required): title of product
  - price (required): price of product
  - inventory (required): inventory of product
  */

  AddItem(req, res){

    // checking the validity of the input
    if (!req.body.title) {
      return res.status(400).send({
        success: 'false',
        message: 'a title is required',
      });
    } else if (!req.body.price) {
      return res.status(400).send({
        success: 'false',
        message: 'a price is required',
      });
    } else if (!req.body.inventory) {
      return res.status(400).send({
        success: 'false',
        message: 'an inventory is required',
      });
    }

    const newItem = { title: req.body.title,
      price: parseFloat(req.body.price),
      inventory: parseInt(req.body.inventory),
    };

    conn.then(client=> client.db('local').collection('shop').insertOne(newItem, (function(err, docs) {
      if(err) {
        console.error(err);
        return res.status(400).send({
          success: 'false',
          message: 'an error occurred',
        });
      } else {
        return res.status(201).send({
          success: 'true',
          message: 'item created successfully',
          item: newItem,
        });
      }
    })));
  }

  /*
  POST: Find an item by passed ID then update the inventory by 1

  BODY:
  - id (required): id of product
  - increment : how much to increase inventory by (default 1)
  */

  IncrementItemInventoryById(req, res){
    var id = null;
    if (!req.body.id) {
      return res.status(400).send({
        success: 'false',
        message: 'an id is required',
      });
    }
    try {
      if (req.body.id) {
        id = ObjectId(req.body.id);
      }
    } catch(err) {
      console.log(err);
      return res.status(400).send({
        success: 'false',
        message: 'that is not a valid id',
      });
    }
    var increment = 1;
    if (req.body.increment){
      increment = parseInt(req.body.increment);
    }
    conn.then(client=> client.db('local').collection('shop').findOneAndUpdate(
      {_id: id},
      {
        $inc: {inventory: increment},
      },
      function(err, item){
        if(err) {
          console.error(err);
          return res.status(400).send({
            success: 'false',
            message: 'an error occurred',
          });
        } else if (!item.value){
          return res.status(400).send({
            success: 'false',
            message: 'item was not found',
          });
        } else {
          return res.status(201).send({
            success: 'true',
            message: 'item inventory incremented successfully',
          });
        }
      }
    ));
  }

  /*
  POST: Find an item by passed title and price then update the inventory by 1

  BODY:
  - title (required): title of product
  - price (required): price of product
  - increment : how much to increase inventory by (default 1)
  */

  IncrementItemInventoryByTitleAndPrice(req, res){
    if (!req.body.title) {
      return res.status(400).send({
        success: 'false',
        message: 'a title is required',
      });
    } else if (!req.body.price) {
      return res.status(400).send({
        success: 'false',
        message: 'a price is required',
      });
    }
    var increment = 1;
    if (req.body.increment){
      increment = parseInt(req.body.increment);
    }
    conn.then(client=> client.db('local').collection('shop').findOneAndUpdate(
      {title: req.body.title, price: parseFloat(req.body.price) },
      {
        $inc: {inventory: increment},
      },
      function(err, item){
        if(err) {
          console.error(err);
          return res.status(400).send({
            success: 'false',
            message: 'an error occurred',
          });
        } else if (!item.value){
          return res.status(400).send({
            success: 'false',
            message: 'item was not found',
          });
        } else {
          return res.status(201).send({
            success: 'true',
            message: 'item inventory incremented successfully',
          });
        }
      }
    ));
  }

  /*
  POST: Takes in an item title. If an item does not exist with that title and price, create a new item,
  otherwise update the inventory of that item by 1.

  BODY:
  - title (required): title of product
  - price (required): price of product

  Notes: refactor this later
  */

  UpsertItemByTitleAndPrice(req, res){
    if (!req.body.title) {
      return res.status(400).send({
        success: 'false',
        message: 'a title is required',
      });
    } else if (!req.body.price) {
      return res.status(400).send({
        success: 'false',
        message: 'a price is required',
      });
    }
    conn.then(client=> client.db('local').collection('shop').findOne(
      {title: req.body.title, price: parseFloat(req.body.price)},
      function(err, item){
        if(err) {
          console.error(err);
          return res.status(400).send({
            success: 'false',
            message: 'an error occurred',
          });
        } else {
          if (!item) {
            const newItem = { title: req.body.title,
              price: parseFloat(req.body.price),
              inventory: parseInt(1),
            };
            conn.then(client=> client.db('local').collection('shop').insertOne(newItem, (function(err, docs) {
              if(err) {
                console.error(err);
                return res.status(400).send({
                  success: 'false',
                  message: 'an error occurred',
                });
              } else {
                return res.status(201).send({
                  success: 'true',
                  message: 'item created successfully',
                  item: newItem,
                });
              }
            })));
          } else {
            conn.then(client=> client.db('local').collection('shop').updateOne(
              {title: req.body.title, price: parseFloat(req.body.price) },
              {
                $inc: {inventory: 1},
              },
              function(err, docs){
                if(err) {
                  console.error(err);
                  return res.status(400).send({
                    success: 'false',
                    message: 'an error occurred',
                  });
                } else {
                  return res.status(201).send({
                    success: 'true',
                    message: 'item inventory incremented successfully',
                  });
                }
              }));
          }
        }
      }
    ));
  }

  /*
  POST: Deletes an item with the corresponding id from the database.

  BODY:
  - id (required): id of product
  */

  DeleteItemById(req, res){
    if (!req.body.id) {
      return res.status(400).send({
        success: 'false',
        message: 'an id is required',
      });
    }
    try {
      var queryId = ObjectId(req.body.id);
      conn.then(client=> client.db('local').collection('shop').deleteOne(
        {_id: ObjectId(queryId)},
        function(err, item){
          if(err) {
            console.error(err);
            return res.status(400).send({
              success: 'false',
              message: 'an error occurred',
            });
          } else if (item.deletedCount === 0){
            return res.status(400).send({
              success: 'false',
              message: 'item was not found',
            });
          } else {
            return res.status(200).send({
              success: 'true',
              message: 'item inventory deleted successfully',
            });
          }
        }
      ));
    } catch(err) {
      console.error(err);
      return res.status(400).send({
        success: 'false',
        message: 'not a valid ID',
      });
    }
  }

  /*
  POST: Deletes an item with the corresponding id from the database.

  BODY:
  - title (required): title of product
  - price (required): price of product
  */

  DeleteItemByTitleAndPrice(req, res){
    if (!req.body.title) {
      return res.status(400).send({
        success: 'false',
        message: 'a title is required',
      });
    } else if (!req.body.price) {
      return res.status(400).send({
        success: 'false',
        message: 'a price is required',
      });
    }
    conn.then(client=> client.db('local').collection('shop').deleteOne(
      {title: req.body.title, price: parseFloat(req.body.price)},
      function(err, item){
        if(err) {
          console.error(err);
          return res.status(400).send({
            success: 'false',
            message: 'an error occurred',
          });
        } else if (item.deletedCount === 0){
          return res.status(400).send({
            success: 'false',
            message: 'item was not found',
          });
        } else {
          return res.status(200).send({
            success: 'true',
            message: 'item inventory deleted successfully',
          });
        }
      }
    ));
  }

  /*
  POST: Find an item by passed ID then decrease the inventory by 1.
  Equivalent to IncrementItemInventoryById with the negative number increment as decrement

  BODY:
  - id (required): id of product
  - decrement: how much to decrease inventory by (default: 1)
  */

  DecrementItemInventoryById(req, res){
    if (!req.body.id) {
      return res.status(400).send({
        success: 'false',
        message: 'an id is required',
      });
    }
    try {
      var decrement = -1;
      if (req.body.decrement){
        decrement = parseInt(req.body.decrement)*-1;
      }
      var queryId = ObjectId(req.body.id);
      conn.then(client=> client.db('local').collection('shop').findOneAndUpdate(
        {_id: ObjectId(queryId), inventory: {$gte:1}},
        {
          $inc: {inventory: decrement},
        },
        function(err, item){
          if(err) {
            console.error(err);
            return res.status(400).send({
              success: 'false',
              message: 'an error occurred',
            });
          } else if (!item.value){
            return res.status(409).send({
              success: 'false',
              message: 'item was not found / had no inventory',
            });
          } else {
            return res.status(201).send({
              success: 'true',
              message: 'item inventory decremented successfully',
            });
          }
        }
      ));
    } catch(err) {
      console.error(err);
      return res.status(400).send({
        success: 'false',
        message: 'not a valid ID',
      });
    }


  }

  /*
  POST: Find an item by passed title and price then decrease the inventory by 1

  BODY:
  - title (required): title of product
  - price (required): price of product
  */

  DecrementItemInventoryByTitleAndPrice(req, res){
    if (!req.body.title) {
      return res.status(400).send({
        success: 'false',
        message: 'a title is required',
      });
    } else if (!req.body.price) {
      return res.status(400).send({
        success: 'false',
        message: 'a price is required',
      });
    }
    var decrement = -1;
    if (req.body.decrement){
      decrement = parseInt(req.body.decrement)*-1;
    }
    conn.then(client=> client.db('local').collection('shop').findOneAndUpdate(
      {title: req.body.title, price: parseFloat(req.body.price), inventory: {$gte:1}},
      {
        $inc: {inventory: decrement},
      },
      function(err, item){
        if(err) {
          console.error(err);
          return res.status(400).send({
            success: 'false',
            message: 'an error occurred',
          });
        } else if (!item.value){
          return res.status(409).send({
            success: 'false',
            message: 'item was not found / had no inventory',
          });
        } else {
          return res.status(200).send({
            success: 'true',
            message: 'item inventory decremented successfully',
          });
        }
      }
    ));
  }

  /*
  GET: Get all items according to passed query parameters

  QUERY PARAMETERS:
  - id: id of product
  - title: title of product
  - available: if inventory greater than 0 (default: false)
  - lowerprice: lower bound on price
  - upperprice: upper bound on price

  OUTPUT:
  {
    Items : Array of Item Objects
    Count : Int (# of results)
  }
  */

  GetItems(req, res){
    var id = null;// = req.query.id;
    var title = null; //= req.query.title;
    var available = false; //= req.query.available;
    var lowerprice = null; //= req.query.lowerprice;
    var upperprice = null;// = req.query.upperprice;
    try {
      if (req.query.id) {
        id = ObjectId(req.query.id);
      }
      if (req.query.title) {
        title = req.query.title;
      }
      if (req.query.available) {
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
      console.log(err);
      return res.status(400).send({
        success: 'false',
        message: 'invalid params',
      });
    }
    var query = {};
    if (id) { query._id = id; }
    if (title) { query.title = title; }
    if (available) { query.inventory = { $gt: 0 }; }
    if (lowerprice) { query.price = { $gte: lowerprice }; }
    if (upperprice) { query.price = { $lte: upperprice }; }
    console.log(query);
    conn.then(client=> client.db('local').collection('shop').find(query).toArray(function(err, docs) {
      if(err) { console.error(err); }
      var response = {};
      response.items = docs;
      response.count = docs.length;
      return res.status(200).send({
        success: 'true',
        response: response,
      });
    }));


    console.log(id, title, available, lowerprice, upperprice);

  }

  AmountGtInventory(req, res){
    if (!req.body.id) {
      return res.status(400).send({
        success: 'false',
        message: 'an id is required',
      });
    }
    try {
      var amount = null;
      if (req.body.amount) {
        amount = parseInt(req.body.amount);
      }
      if (isNaN(amount)){
        throw new Error("Amount is not a number");
      }
      var queryId = ObjectId(req.body.id);
      conn.then(client=> client.db('local').collection('shop').findOne(
        {_id: ObjectId(queryId)},
        function(err, item){
          if(err) {
            console.error(err);
            return res.status(400).send({
              success: 'false',
              message: 'an error occurred',
            });
          } else if (!item){
            return res.status(409).send({
              success: 'false',
              message: 'item was not found / had no inventory',
            });
          } else {
            var response = false;
            if (amount > item.inventory) {
              response = true;
            }
            return res.status(201).send({
              success: 'true',
              response: response,
            });
          }
        }
      ));
    } catch(err) {
      console.error(err);
      return res.status(400).send({
        success: 'false',
        message: 'not a valid ID or a valid amount',
      });
    }
  }

}

const shopController = new ShopController();
export default shopController;