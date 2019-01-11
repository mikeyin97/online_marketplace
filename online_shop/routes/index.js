const express = require('express');
const ShopController = require('../controllers/shop');
const CartController = require('../controllers/cart');
var passport = require('passport');
const AuthController = require('../controllers/auth');

const router = express.Router();

router.post('/api/addItem', isLoggedIn, ShopController.AddItem);
router.post('/api/incrementItemById', ShopController.IncrementItemInventoryById);
router.post('/api/incrementItemByTitleAndPrice', ShopController.IncrementItemInventoryByTitleAndPrice);
router.post('/api/upsertItemByTitleAndPrice', ShopController.UpsertItemByTitleAndPrice);
router.post('/api/decrementItemById', ShopController.DecrementItemInventoryById);
router.post('/api/decrementItemByTitleAndPrice', ShopController.DecrementItemInventoryByTitleAndPrice);
router.post('/api/deleteItemById', isLoggedIn, ShopController.DeleteItemById);
router.post('/api/deleteItemByTitleAndPrice', isLoggedIn, ShopController.DeleteItemByTitleAndPrice);
router.post('/api/amountGtInventory', ShopController.AmountGtInventory);
router.get('/api/getItems', ShopController.GetItems);

router.get('/api/viewCart', isLoggedIn, CartController.ViewCart);
router.post('/api/emptyCart', isLoggedIn, CartController.EmptyCart);
router.post('/api/addToCartById', isLoggedIn, CartController.AddToCartById);
router.post('/api/removeFromCartById', isLoggedIn, CartController.RemoveFromCartById);
router.post('/api/completeCartPurchase', isLoggedIn, CartController.CompleteCartPurchase);

router.post('/login', passport.authenticate('local-login'), AuthController.Login);
router.post('/signup', passport.authenticate('local-signup'), AuthController.Signup);

router.get('/profile', isLoggedIn, AuthController.Login);
router.get('/logout', isLoggedIn, AuthController.Logout);

function isLoggedIn(req, res, next) {
  if (process.env.NODE_ENV === 'test') //testing skips login
    return next();
  if (req.isAuthenticated())
    return next();
  return res.status(401).send({
    success: 'false',
    message: 'Unauthenticated',
  });
}

module.exports = router;