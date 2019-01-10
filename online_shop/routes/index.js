import express from 'express';
import ShopController from '../controllers/shop';
import CartController from '../controllers/cart';

const router = express.Router();

router.post('/api/addItem', ShopController.AddItem);
router.post('/api/incrementItemById', ShopController.IncrementItemInventoryById);
router.post('/api/incrementItemByTitleAndPrice', ShopController.IncrementItemInventoryByTitleAndPrice);
router.post('/api/upsertItemByTitleAndPrice', ShopController.UpsertItemByTitleAndPrice);
router.post('/api/decrementItemById', ShopController.DecrementItemInventoryById);
router.post('/api/decrementItemByTitleAndPrice', ShopController.DecrementItemInventoryByTitleAndPrice);
router.post('/api/deleteItemById', ShopController.DeleteItemById);
router.post('/api/deleteItemByTitleAndPrice', ShopController.DeleteItemByTitleAndPrice);
router.get('/api/getItems', ShopController.GetItems);
router.post('/api/amountGtInventory', ShopController.AmountGtInventory);

router.get('/api/viewCart', CartController.ViewCart);
router.post('/api/emptyCart', CartController.EmptyCart);
router.post('/api/addToCartById', CartController.AddToCartById);
router.post('/api/removeFromCartById', CartController.RemoveFromCartById);
router.post('/api/completeCartPurchase', CartController.CompleteCartPurchase);

export default router;