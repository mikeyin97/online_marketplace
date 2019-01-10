import ShopController from './shop';
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
                    message: 'Your cart amount would exceed current inventory. The item has not been added',
                    response: cart,
                });
            } else {
                if (cartObj){
                    cartObj.count += amountToAdd;
                } else{
                    cart.push({id: req.body.id, count: amountToAdd})
                }
                return res.status(200).send({
                    success: 'true',
                    message: 'Your cart has been updated',
                    response: cart,
                });
            }
        });
        
        //check = ShopController.AmountGteInventory({body:{id: req.body.id, amount: amount}});
        //console.log(check);
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
                response: cart,
            });
        }
        cartObj.count = Math.max(0, cartObj.count - amount);
        return res.status(200).send({
            success: 'true',
            message: 'Your cart has been updated. Please note the cart cannot have an item with less than 0 count.',
            response: cart,
        });
    }

    EmptyCart(req, res){
        cart = [];
        queuedActions = [];
        return res.status(200).send({
            success: 'true',
            response: 'cart successfully emptied'
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
        // loop over the queued actions and actually conduct it. 
        // body shhould have the total value whhich we keep as a running sum
        // empty the queued actions and the cart. 
        
    }
}
  
const cartController = new CartController();
export default cartController;