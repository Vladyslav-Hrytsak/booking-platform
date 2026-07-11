import { Request, Response } from 'express';
import { listingService } from '../services/listingService';

export const listingController = {
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const filters = {
                subcategoryId: req.query.subcategoryId as string | undefined,
                city: req.query.city as string | undefined,
            };
            const listings = await listingService.getAll(filters);
            res.status(200).json(listings);
        } catch {
            res.status(500).json({ error: 'Failed to fetch listings' });
        }
    },

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const listing = await listingService.getById(req.params.id as string);
            res.status(200).json(listing);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error';
            if (message === 'Listing not found') {
                res.status(404).json({ error: message });
                return;
            }
            res.status(500).json({ error: 'Failed to fetch listing' });
        }
    },

    async create(req: Request, res: Response): Promise<void> {
        try {
            const listing = await listingService.create(req.user!.userId, req.body);
            res.status(201).json(listing);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error';

            const errorMap: Record<string, number> = {
                'Provider profile not found': 404,
                'Forbidden': 403,
                // бизнес-правило — не вопрос прав
                'Provider profile is not approved': 400,
                'Free plan listing limit reached': 400,
            };

            const status = errorMap[message] ?? 500;
            res.status(status).json({ error: message });
        }
    },

    async update(req: Request, res: Response): Promise<void> {
        try {
            const listing = await listingService.update(
                req.params.id as string,
                req.user!.userId,
                req.body
            );
            res.status(200).json(listing);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error';
            const errorMap: Record<string, number> = {
                'Listing not found': 404,
                'Forbidden': 403,
            };
            const status = errorMap[message] ?? 500;
            res.status(status).json({ error: message });
        }
    },

    async setActive(req: Request, res: Response): Promise<void> {
        try {
            const { isActive } = req.body;
            if (typeof isActive !== 'boolean') {
                res.status(400).json({ error: 'isActive must be a boolean' });
                return;
            }
            const listing = await listingService.setActive(
                req.params.id as string,
                req.user!.userId,
                isActive
            );
            res.status(200).json(listing);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error';
            const errorMap: Record<string, number> = {
                'Listing not found': 404,
                'Forbidden': 403,
            };
            const status = errorMap[message] ?? 500;
            res.status(status).json({ error: message });
        }
    },
};