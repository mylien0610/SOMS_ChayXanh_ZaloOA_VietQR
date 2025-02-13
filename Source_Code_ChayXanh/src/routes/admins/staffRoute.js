import express from 'express';
import { StaffController } from '../../app/http/controllers/admins';

const router = express.Router();

router.get('/', StaffController.index);
router.get('/all', StaffController.all);
router.get('/unassigned/:storeId', StaffController.getUnassignedStaffs);
router.get('/available-staffs/:id', StaffController.getAvailableStaffs);
router.get('/:id', StaffController.find);
router.post('/', StaffController.store);
router.put('/:id', StaffController.update);
router.delete('/:id', StaffController.delete);

export default router;
