import express from 'express';
import { CategoryController } from '../../app/http/controllers/admins';

const router = express.Router();

// GET /categories
router.get('/', CategoryController.index);

// GET /categories/all
router.get('/all', CategoryController.all);

// POST /categories
router.post('/', CategoryController.store);

// GET /categories/:id
router.get('/:id', CategoryController.find);

// PUT /categories/:id
router.put('/:id', CategoryController.update);

// DELETE /categories/:id
router.delete('/:id', CategoryController.delete);

export default router;
