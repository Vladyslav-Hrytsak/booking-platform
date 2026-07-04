import { Request, Response } from 'express';
import { categoryService } from '../services/categoryService';
import { Prisma } from '../../generated/prisma/client';

export const categoryController = {
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const categories = await categoryService.getAll();
            res.status(200).json(categories);
        } catch {
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    },

    async createCategory(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.body;
            if (!name || typeof name !== 'string') {
                res.status(400).json({ error: 'Name is required' });
                return;
            }

            const category = await categoryService.createCategory(name);
            res.status(201).json(category);
        } catch (error) {
            // P2002 — это код Prisma для нарушения уникального ограничения
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                res.status(409).json({ error: 'Category with this name already exists' });
                return;
            }
            res.status(500).json({ error: 'Failed to create category' });
        }
    },

    async createSubcategory(req: Request, res: Response): Promise<void> {
        try {
            const categoryId = req.params.categoryId as string;
            const { name } = req.body;

            if (!name || typeof name !== 'string') {
                res.status(400).json({ error: 'Name is required' });
                return;
            }

            const subcategory = await categoryService.createSubcategory(categoryId, name);
            res.status(201).json(subcategory);
        } catch (error) {
            if (error instanceof Error && error.message === 'Category not found') {
                res.status(404).json({ error: 'Category not found' });
                return;
            }
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                res.status(409).json({ error: 'Subcategory with this name already exists in this category' });
                return;
            }
            res.status(500).json({ error: 'Failed to create subcategory' });
        }
    },
}