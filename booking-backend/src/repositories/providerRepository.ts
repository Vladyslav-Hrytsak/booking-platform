import { prisma } from './prismaClient';

export const providerRepository = {
    // Найти профиль по id — для публичной карточки и проверки владения
    async findById(id: string) {
        return prisma.providerProfile.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
                specializations: {
                    include: {
                        subcategory: true,
                    },
                },
            },
        });
    },

    // Найти профиль по userId — нужно при создании чтобы проверить дубль
    async findByUserId(userId: string) {
        return prisma.providerProfile.findUnique({
            where: { userId },
        });
    },

    // Создать профиль
    async create(userId: string, data: { bio?: string; phone?: string; city: string }) {
        return prisma.providerProfile.create({
            data: {
                userId,
                ...data,
            },
        });
    },

    // Обновить данные профиля (bio, phone, city)
    async update(id: string, data: { bio?: string; phone?: string; city?: string }) {
        return prisma.providerProfile.update({
            where: { id },
            data,
        });
    },

    // Обновить статус модерации — только для ADMIN
    async updateStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'BANNED') {
        return prisma.providerProfile.update({
            where: { id },
            data: { status },
        });
    },

    // Добавить специализацию провайдеру
    async addSpecialization(providerProfileId: string, subcategoryId: string) {
        return prisma.providerSpecialization.create({
            data: { providerProfileId, subcategoryId },
        });
    },
};