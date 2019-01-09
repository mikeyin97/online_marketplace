import express from 'express';
import ShopController from '../controllers/shop';

const router = express.Router();

router.post('/api/addItem', ShopController.AddItem);
router.post('/api/incrementItemByTitle', ShopController.IncrementItemInventoryByTitle)
router.post('/api/incrementItemById', ShopController.IncrementItemInventoryById)
//router.post('/api/addItem', ShopController.addItem);
/*router.get('/api/todos', ShopController.getAllTodos);
router.get('/api/todos/:id', ShopController.getTodo);
router.post('/api/todos', ShopController.createTodo);
router.put('/api/todos/:id', ShopController.updateTodo);
router.delete('/api/todos/:id', ShopController.deleteTodo);
router.get('/api/test', ShopController.test);*/

export default router;