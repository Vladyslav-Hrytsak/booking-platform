import { Router } from 'express';
import { listingController } from '../controllers/listingController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

// Публичные маршруты
router.get('/', listingController.getAll);
router.get('/:id', listingController.getById);

// Защищённые маршруты
router.post('/', requireAuth, listingController.create);
router.patch('/:id', requireAuth, listingController.update);
router.patch('/:id/active', requireAuth, listingController.setActive);

export default router;