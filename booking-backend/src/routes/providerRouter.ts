import { Router } from 'express';
import { providerController } from '../controllers/providerController';
import { requireAuth, requireRole } from '../middleware/requireAuth';

const router = Router();

// Публичный — карточка провайдера видна всем
router.get('/:id', providerController.getById);

// Создать профиль — любой авторизованный USER
router.post('/', requireAuth, providerController.create);

// Редактировать свой профиль — только владелец (проверка в service)
router.patch('/:id', requireAuth, providerController.update);

// Сменить статус модерации — только ADMIN
router.patch(
    '/:id/status',
    requireAuth,
    requireRole('ADMIN'),
    providerController.updateStatus
);

// Добавить специализацию — только владелец профиля
router.post('/:id/specializations', requireAuth, providerController.addSpecialization);

export default router;