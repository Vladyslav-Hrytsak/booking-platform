import { providerRepository } from '../repositories/providerRepository';

interface CreateProfileDto {
    bio?: string;
    phone?: string;
    city: string;
}

interface UpdateProfileDto {
    bio?: string;
    phone?: string;
    city?: string;
}

export const providerService = {
    async getById(id: string) {
        const profile = await providerRepository.findById(id);
        if (!profile) {
            throw new Error('Profile not found');
        }
        return profile;
    },

    async create(userId: string, dto: CreateProfileDto) {
        // Проверяем что профиль ещё не существует
        // Хотя БД защищает через @unique — лучше дать понятную ошибку заранее
        const existing = await providerRepository.findByUserId(userId);
        if (existing) {
            throw new Error('Profile already exists');
        }
        return providerRepository.create(userId, dto);
    },

    async update(id: string, requestUserId: string, dto: UpdateProfileDto) {
        // Получаем профиль
        const profile = await providerRepository.findById(id);
        if (!profile) {
            throw new Error('Profile not found');
        }

        // Проверка владения: userId профиля должен совпадать с userId из токена
        if (profile.userId !== requestUserId) {
            throw new Error('Forbidden');
        }

        return providerRepository.update(id, dto);
    },

    async updateStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'BANNED') {
        const profile = await providerRepository.findById(id);
        if (!profile) {
            throw new Error('Profile not found');
        }
        return providerRepository.updateStatus(id, status);
    },

    async addSpecialization(id: string, requestUserId: string, subcategoryId: string) {
        const profile = await providerRepository.findById(id);
        if (!profile) {
            throw new Error('Profile not found');
        }

        // Только владелец может добавлять свои специализации
        if (profile.userId !== requestUserId) {
            throw new Error('Forbidden');
        }

        return providerRepository.addSpecialization(id, subcategoryId);
    },
};