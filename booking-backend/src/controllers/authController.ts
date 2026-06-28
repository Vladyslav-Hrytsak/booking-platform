import { Request, Response } from 'express';
import { authService } from '../services/authService';

export const authController = {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const result = await authService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Registration failed';
            const status = message === 'Email already in use' ? 409 : 500;
            res.status(status).json({ error: message });
        }
    },

    async login(req: Request, res: Response): Promise<void> {
        try {
            const result = await authService.login(req.body);
            res.status(200).json(result);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Login failed';
            const status = message === 'Invalid credentials' ? 401 : 500;
            res.status(status).json({ error: message });
        }
    },

    async refresh(req: Request, res: Response): Promise<void> {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(400).json({ error: 'Refresh token required' });
                return;
            }
            const result = await authService.refresh(refreshToken);
            res.status(200).json(result);
        } catch (error) {
            res.status(401).json({ error: 'Invalid refresh token' });
        }
    },
};