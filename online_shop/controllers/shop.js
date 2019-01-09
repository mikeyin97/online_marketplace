/* eslint-disable class-methods-use-this */
import db from '../dummy_db/db';
var MongoClient = require('mongodb').MongoClient;
var conn = MongoClient.connect('mongodb://localhost:27017/')


class ShopController {

  UpdateItemById(req, res){
    conn.then(client=> client.db('calendar').collection('errors').find({}).toArray(function(err, docs) {
      if(err) { console.error(err) }
      res.send(JSON.stringify(docs))
  }))
  }

  // Upsert as many inventories as needed
  UpsertItem(req, res){

  }
  
  // add one new Item to the product if it exists just update the inventory
  // takes title + price as input
  UpsertSingleItem(req, res) {
  }

  // get all items
  getAllItems(req, res){
  }

  // get items by ID
  getItemsById(req, res){
  }

  // get items by product title
  getItemsByTitle(req, res){
  }
  
  // get items by a filter on the price
  getItemsByPrice(req, res){

  }

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