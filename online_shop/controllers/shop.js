/* eslint-disable class-methods-use-this */
//import db from '../dummy_db/db';
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;


var conn = MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true })



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
    conn.then(client=> client.db('local').collection('shop').insert(newItem, (function(err, docs) {
      if(err) { console.error(err) }
      return res.status(201).send({
        success: 'true',
        message: 'item created successfully',
        item: newItem,
      });
    })))
  }

  /* 
  POST: Find an item by passed ID then update the inventory by 1
  
  BODY:
  - id (required): id of product
  */
  IncrementItemInventoryById(req, res){
    if (!req.body.id) {
      return res.status(400).send({
        success: 'false',
        message: 'an id is required',
      });
    }
    conn.then(client=> client.db('local').collection('shop').updateOne(
      {_id: ObjectId(req.body.id)}, 
      {
        $inc: {inventory: 1},
      },
      function(err, docs){ 
        if(err) {console.error(err)}
        return res.status(201).send({
          success: 'true',
          message: 'item inventory incremented successfully',
        });
      }))
  }

  /* 
  POST: Find an item by passed title then update the inventory by 1

  BODY:
  - title (required): title of product
  */
  IncrementItemInventoryByTitle(req, res){
  if (!req.body.title) {
    return res.status(400).send({
      success: 'false',
      message: 'a title is required',
    });
  }
  conn.then(client=> client.db('local').collection('shop').updateOne(
    {title: req.body.title}, 
    {
      $inc: {inventory: 1},
    },
    function(err, docs){ 
      if(err) {console.error(err)}
      return res.status(201).send({
        success: 'true',
        message: 'item inventory incremented successfully',
      });
    }))
  }


  /*
  POST: Takes in an item title. If an item does not exist with that title and price, create a new item, 
  otherwise update the inventory of that item by 1. 

  BODY:
  - title (required): title of product
  - price (required): price of product
  */
  UpsertItemInventoryByTitle(req, res){
    if (!req.body.title) {
      return res.status(400).send({
        success: 'false',
        message: 'a title is required',
      });
    } 
  }
  
  // add one new Item to the product if it exists just update the inventory
  // takes title + price as input
  UpsertItemInventoryById(req, res) {
  }

  // get all items
  // Query Params: ID, Title, Available, lowerprice, upperprice
  getItems(req, res){
    
  }
  /*
  // get items by ID
  getItemsById(req, res){
  }

  // get items by product title
  getItemsByTitle(req, res){
  }
  
  // get items by a filter on the price
  getItemsByPrice(req, res){

  }
  */

  deleteItemById(req, res){
  }

  deleteItemByTitle(req,res){
  }

  // reduce Inventory by 1
  purchaseItemByName(req,res){

  }

  // reduce Inventory by 1
  purchaseItemById(req,res){

  }

}

const shopController = new ShopController();
export default shopController;