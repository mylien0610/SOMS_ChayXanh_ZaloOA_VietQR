import express from 'express';
import TableController from '../../app/http/controllers/admins/TableController';

const router = express.Router();

router.get('/', TableController.index);
router.get('/all', TableController.all);
router.get('/:id', TableController.find);
router.put('/:id', TableController.update);
router.delete('/:id', TableController.delete);
router.post('/', TableController.store);

export default router;
