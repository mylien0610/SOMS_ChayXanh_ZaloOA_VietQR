import express from 'express';
import ProductController from '../../app/http/controllers/admins/ProductController';

const router = express.Router();

// Các route GET
router.get('/', ProductController.index);
router.get('/all', ProductController.all);
router.get('/:id', ProductController.find);

// Route POST
router.post('/', ProductController.store);

// Route PUT
router.put('/:id', ProductController.update);

// Route DELETE
router.delete('/:id', ProductController.delete);

export default router;
