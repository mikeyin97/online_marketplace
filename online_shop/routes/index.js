import express from 'express';
import ShopController from '../controllers/shop';

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
//router.post('/api/addItem', ShopController.addItem);
/*router.get('/api/todos', ShopController.getAllTodos);
router.get('/api/todos/:id', ShopController.getTodo);
router.post('/api/todos', ShopController.createTodo);
router.put('/api/todos/:id', ShopController.updateTodo);
router.delete('/api/todos/:id', ShopController.deleteTodo);
router.get('/api/test', ShopController.test);*/

export default router;