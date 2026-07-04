import { categoryRepository } from '../repositories/categoryRepository';

export const categoryService = {
    async getAll() {
        return categoryRepository.findAll();
    },

    async createCategory(name: string) {
        return categoryRepository.create(name);
    },

    async createSubcategory(categoryId: string, name: string) {
        const category = await categoryRepository.findById(categoryId);
        if (!category) {
            throw new Error('Category not found');
        }

        return categoryRepository.createSubcategory(categoryId, name);
    },
};