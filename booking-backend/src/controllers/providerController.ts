import { Request, Response } from 'express';
import { providerService } from '../services/providerService';
import { Prisma } from '../../generated/prisma/client';

export const providerController = {
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const profile = await providerService.getById(req.params.id as string);
            res.status(200).json(profile);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error';
            if (message === 'Profile not found') {
                res.status(404).json({ error: message });
                return;
            }
            res.status(500).json({ error: 'Failed to fetch profile' });
        }
    },

    async create(req: Request, res: Response): Promise<void> {
        try {
            // userId берём из токена — не из body
            const userId = req.user!.userId;
            const profile = await providerService.create(userId, req.body);
            res.status(201).json(profile);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error';
            if (message === 'Profile already exists') {
                res.status(409).json({ error: message });
                return;
            }
            res.status(500).json({ error: 'Failed to create profile' });
        }
    },

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const requestUserId = req.user!.userId;
            const profile = await providerService.update(id, requestUserId, req.body);
            res.status(200).json(profile);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error';
            if (message === 'Profile not found') {
                res.status(404).json({ error: message });
                return;
            }
            // Знаем кто это, но это не его профиль
            if (message === 'Forbidden') {
                res.status(403).json({ error: message });
                return;
            }
            res.status(500).json({ error: 'Failed to update profile' });
        }
    },

    async updateStatus(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const { status } = req.body;

            if (!['APPROVED', 'REJECTED', 'BANNED'].includes(status)) {
                res.status(400).json({ error: 'Invalid status value' });
                return;
            }

            const profile = await providerService.updateStatus(id, status);
            res.status(200).json(profile);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error';
            if (message === 'Profile not found') {
                res.status(404).json({ error: message });
                return;
            }
            res.status(500).json({ error: 'Failed to update status' });
        }
    },

    async addSpecialization(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const requestUserId = req.user!.userId;
            const { subcategoryId } = req.body;

            if (!subcategoryId) {
                res.status(400).json({ error: 'subcategoryId is required' });
                return;
            }

            const specialization = await providerService.addSpecialization(
                id,
                requestUserId,
                subcategoryId
            );
            res.status(201).json(specialization);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error';
            if (message === 'Profile not found') {
                res.status(404).json({ error: message });
                return;
            }
            if (message === 'Forbidden') {
                res.status(403).json({ error: message });
                return;
            }
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                res.status(409).json({ error: 'Specialization already exists' });
                return;
            }
            res.status(500).json({ error: 'Failed to add specialization' });
        }
    },
};