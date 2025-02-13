import express from 'express';
import { TypeOfFoodController } from '../../app/http/controllers/admins';

const router = express.Router();

// GET /typeOfFoods
router.get('/', TypeOfFoodController.index);

// GET /typeOfFoods/all
router.get('/all', TypeOfFoodController.all);

// POST /typeOfFoods
router.post('/', TypeOfFoodController.store);

// GET /typeOfFoods/:id
router.get('/:id', TypeOfFoodController.find);

// PUT /typeOfFoods/:id
router.put('/:id', TypeOfFoodController.update);

// DELETE /typeOfFoods/:id
router.delete('/:id', TypeOfFoodController.delete);

export default router;
