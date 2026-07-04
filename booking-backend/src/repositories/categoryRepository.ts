import { prisma } from './prismaClient';

export const categoryRepository = {
    async findAll() {
        return prisma.category.findMany({
            include: {
                subcategories: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    },

    async findById(id: string) {
        return prisma.category.findUnique({
            where: { id },
            include: { subcategories: true },
        });
    },

    async create(name: string) {
        return prisma.category.create({
            data: { name },
        });
    },

    async createSubcategory(categoryId: string, name: string) {
        return prisma.subcategory.create({
            data: { categoryId, name },
        });
    },
};