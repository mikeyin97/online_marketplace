var ObjectId = require('mongodb').ObjectID;
var request = require('request');

var cart = [];

class CartController {
    
    AddToCartById(req, res){
        var id = null;
        var amount = 1;
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
        if (req.body.amount){
            amount = parseInt(req.body.amount);
        }
        var amountToAdd = amount;
        var amountToCompare = amount;
        var cartObj = cart.find(o => o.id === req.body.id);
        amountToCompare += cartObj ? cartObj.count : 0;
        request.post({
            url:     'http://localhost:9999/api/amountGtInventory',
            body: {id: req.body.id, amount: amountToCompare},
            headers:{
                'Content-Type': 'application/json'
            },
            json: true
          }, function(error, response, body){
            if (body.response === true){
                return res.status(400).send({
                    success: 'false',
                    message: 'Your cart amount would exceed current inventory. The item has not been added.',
                    current_cart: cart,
                });
            } else {
                if (cartObj){
                    cartObj.count += amountToAdd;
                    return res.status(200).send({
                        success: 'true',
                        message: 'Your cart has been updated',
                        current_cart: cart,
                    });
                } else {
                    console.log('http://localhost:9999/api/getItems?id='+req.body.id)
                    request.get({
                        url:     'http://localhost:9999/api/getItems?id='+req.body.id,
                      }, function(error, response, body){
                        body = JSON.parse(body);
                        if (body.response.count === 0){
                            return res.status(400).send({
                                success: 'false',
                                message: 'Item with this ID does not exist',
                                current_cart: cart,
                            });
                        } else {
                            var item = body.response.items[0]
                            console.log(item);
                            cart.push({id: req.body.id, title: item.title, price: item.price, count: amountToAdd})
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
        var id = null;
        var amount = 1;
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
        if (req.body.amount){
            amount = parseInt(req.body.amount);
        }
        var cartObj = cart.find(o => o.id === req.body.id);
        if (!cartObj){
            return res.status(200).send({
                success: 'false',
                message: 'This item does not exist.',
                current_cart: cart,
            });
        }
        if (cartObj.count - amount < 0){
            cartObj.count = 0
            return res.status(200).send({
                success: 'false',
                message: 'The cart cannot have an item with less than 0 count. No changes have been made',
                current_cart: cart,
            });
        } else{
            cartObj.count = cartObj.count - amount;
            return res.status(200).send({
                success: 'true',
                message: 'Your cart has been updated. Please note the cart cannot have an item with less than 0 count.',
                current_cart: cart,
            });
        }
    }

    EmptyCart(req, res){
        cart = [];
        return res.status(200).send({
            success: 'true',
            response: 'cart successfully emptied',
            current_cart: cart,
        });
    }

    ViewCart(req, res){
        var response = {};
        response.cart = cart;
        response.count = cart.length;
        return res.status(200).send({
            success: 'true',
            response: response,
        });
    }

    CompleteCartPurchase(req, res){
        var cartTotal = 0;
        var oldcart = null;
        if (cart.length === 0){
            oldcart = cart;
            cart = [];
            return res.status(200).send({
                success: 'true',
                response: 'purchase completed (you should buy something next time!)',
                purchase: oldcart,
                current_cart: cart,
                cost: cartTotal,
            })
        }
        cart.forEach(function(item, index, array){
            cartTotal += item.count * item.price;
            request.post({
                url:     'http://localhost:9999/api/decrementItemById',
                body: { id: item.id, decrement: item.count},
                headers:{
                    'Content-Type': 'application/json'
                },
                json: true
            });
            if (index+1 === array.length) {
                oldcart = cart;
                cart = [];
                return res.status(200).send({
                    success: 'true',
                    response: 'purchase completed',
                    purchase: oldcart,
                    current_cart: cart,
                    cost: cartTotal,
                });
            }
        })
        
        
    }
}
  
const cartController = new CartController();
export default cartController;