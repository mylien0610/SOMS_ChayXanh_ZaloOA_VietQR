import express from 'express';
import { VoucherController } from '../../app/http/controllers/admins';

const router = express.Router();

router.get('/', VoucherController.index);
router.get('/all', VoucherController.all);
router.get('/getOrders/:id', VoucherController.getOrdersByVoucherId);
router.post('/verify', VoucherController.verifyVoucher);
router.post('/', VoucherController.store);
router.get('/:id', VoucherController.find);
router.put('/:id', VoucherController.update);
router.delete('/:id', VoucherController.delete);

export default router;
