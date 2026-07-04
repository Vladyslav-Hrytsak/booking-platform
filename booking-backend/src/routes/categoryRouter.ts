import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireAuth';

const router = Router();

// GET /categories — публичный, без middleware
router.get('/', categoryController.getAll);

// POST /categories — только ADMIN
// requireAuth сначала проверяет токен, requireRole проверяет роль
// порядок важен: нельзя проверить роль не зная кто это
router.post('/', requireAuth, requireRole('ADMIN'), categoryController.createCategory);

// POST /categories/:categoryId/subcategories — только ADMIN
router.post(
    '/:categoryId/subcategories',
    requireAuth,
    requireRole('ADMIN'),
    categoryController.createSubcategory
);

export default router;