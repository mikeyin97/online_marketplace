let express = require('express');
let ShopController = require('../controllers/shop');
let CartController = require('../controllers/cart');
var passport = require('passport');
let AuthController = require('../controllers/auth');

const router = express.Router();

router.post('/api/addItem', ShopController.AddItem);
router.post('/api/incrementItemById', ShopController.IncrementItemInventoryById);
router.post('/api/incrementItemByTitleAndPrice', ShopController.IncrementItemInventoryByTitleAndPrice);
router.post('/api/upsertItemByTitleAndPrice', ShopController.UpsertItemByTitleAndPrice);
router.post('/api/decrementItemById', ShopController.DecrementItemInventoryById);
router.post('/api/decrementItemByTitleAndPrice', ShopController.DecrementItemInventoryByTitleAndPrice);
router.post('/api/deleteItemById', ShopController.DeleteItemById);
router.post('/api/deleteItemByTitleAndPrice', ShopController.DeleteItemByTitleAndPrice);
router.post('/api/amountGtInventory', ShopController.AmountGtInventory);
router.get('/api/getItems', ShopController.GetItems);

router.get('/api/viewCart', CartController.ViewCart);
router.post('/api/emptyCart', CartController.EmptyCart);
router.post('/api/addToCartById', CartController.AddToCartById);
router.post('/api/removeFromCartById', CartController.RemoveFromCartById);
router.post('/api/completeCartPurchase', CartController.CompleteCartPurchase);

router.post('/login', passport.authenticate('local-login'), AuthController.Login);
router.get('/profile', isLoggedIn, AuthController.Login);

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    return res.status(401).send({
        success: 'false',
        message: 'Unauthenticated',
        });
}
  
module.exports = router;