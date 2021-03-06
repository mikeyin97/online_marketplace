var ObjectId = require('mongodb').ObjectID;
var request = require('request');

var cart = {items:[], price:0};
if (process.env.NODE_ENV === 'test'){
  cart = {
    items: [
      {
        "id": "000000000000000000000002",
        "title": "pen",
        "price": 0.99,
        "count": 1,
      },
    ],
    "price": 0.99,
  };
}


class CartController {

  AddToCartById(req, res){

    // check for the existence and validity of id
    var id = null;
    var amount = 1;
    if (!req.body.id) {
      return res.status(400).send({
        success: 'false',
        message: 'An id is required',
        current_cart: cart,
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
        current_cart: cart,
      });
    }

    // if amount is provided, set the amount variable to that value
    if (req.body.amount){
      amount = parseInt(req.body.amount);
    }
    var amountToAdd = amount;
    var amountToCompare = amount;

    // the value we compare to inventory is the amount provided + the count in the cart
    var cartObj = cart.items.find(o => o.id === req.body.id);
    amountToCompare += cartObj ? cartObj.count : 0;
    request.post({
      url:     'http://localhost:9999/api/amountGtInventory',
      body: {id: req.body.id, amount: amountToCompare},
      headers:{
        'Content-Type': 'application/json',
      },
      json: true,
    }, function(error, response, body){
      if (body.response === true){
        // if the amount provided + the count in the cart exceeds item inventory
        return res.status(400).send({
          success: 'false',
          message: 'Your cart amount would exceed current inventory. The item has not been added.',
          current_cart: cart,
        });
      } else {
        if (cartObj){
          // if item already in cart, just add the amount provided to the count in the cart
          cartObj.count += amountToAdd;
          cart.price += amountToAdd*cartObj.price;
          return res.status(200).send({
            success: 'true',
            message: 'Your cart has been updated',
            current_cart: cart,
          });
        } else {
          // get the item by id (if it exists), and add that to the cart with count equalling the amount provided
          request.get({
            url:     'http://localhost:9999/api/getItems?id='+req.body.id,
          }, function(error, response, body){
            body = JSON.parse(body);
            if (body.response.count === 0){
              // if item doesn't exist
              return res.status(400).send({
                success: 'false',
                message: 'Item with this ID does not exist',
                current_cart: cart,
              });
            } else {
              var item = body.response.items[0];
              cart.items.push({id: req.body.id, title: item.title, price: item.price, count: amountToAdd});
              cart.price += amountToAdd*item.price;
              return res.status(200).send({
                success: 'true',
                message: 'Your cart has been updated',
                current_cart: cart,
              });
            }
          });
        }
      }
    });
  }

  RemoveFromCartById(req, res){
    // check for validity and existence of id
    var id = null;
    var amount = 1;
    if (!req.body.id) {
      return res.status(400).send({
        success: 'false',
        message: 'An id is required',
        current_cart: cart,
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
        current_cart: cart,
      });
    }

    // if amount is provided, set the amount variable to that value
    if (req.body.amount){
      amount = parseInt(req.body.amount);
    }

    var cartObj = cart.items.find(o => o.id === req.body.id);
    if (!cartObj){
      return res.status(400).send({
        success: 'false',
        message: 'This item does not exist in your cart.',
        current_cart: cart,
      });
    }
    if (cartObj.count - amount < 0){
      // if the amount to be removed from the cart exceeds the count of the item in the cart
      return res.status(400).send({
        success: 'false',
        message: 'The cart cannot have an item with less than 0 count. No changes have been made',
        current_cart: cart,
      });
    } else{
      cart.price -= (cartObj.price*amount);
      cartObj.count = cartObj.count - amount;
      return res.status(200).send({
        success: 'true',
        message: 'Your cart has been updated.',
        current_cart: cart,
      });
    }
  }

  EmptyCart(req, res){
    cart = {items:[], price:0};
    return res.status(200).send({
      success: 'true',
      message: 'Cart successfully emptied',
      current_cart: cart,
    });
  }

  ViewCart(req, res){
    var response = {};
    response.cart = cart;
    response.count = cart.items.length;
    return res.status(200).send({
      success: 'true',
      current_cart: response,
    });
  }

  CompleteCartPurchase(req, res){

    // for each item in the cart, decrement the item in the shop by the corresponding count.
    // keep a running sum for the total cost of the cart
    var oldcart = null;

    if (cart.items.length === 0){
      // if your cart is empty
      oldcart = cart;
      cart = {items:[], price:0};
      return res.status(200).send({
        success: 'true',
        response: 'Purchase completed (you should buy something next time!)',
        purchase: oldcart,
        current_cart: cart,
      });
    }
    cart.items.forEach(function(item, index, array){
      //cartTotal += item.count * item.price;
      request.post({
        url:     'http://localhost:9999/api/decrementItemById',
        body: { id: item.id, decrement: item.count},
        headers:{
          'Content-Type': 'application/json',
        },
        json: true,
      });
      if (index+1 === array.length) {
        oldcart = cart;
        cart = {items:[], price:0};
        return res.status(200).send({
          success: 'true',
          response: 'Purchase completed',
          purchase: oldcart,
          current_cart: cart,
        });
      }
    });


  }

}

const cartController = new CartController();
module.exports = cartController;