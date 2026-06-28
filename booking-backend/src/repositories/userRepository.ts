import { prisma } from './prismaClient';
import { RegisterDto } from '../types/auth';

export const userRepository = {

    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
        });
    },

    async findById(id: string) {
        return prisma.user.findUnique({
            where: { id },
        });
    },


    async create(data: Omit<RegisterDto, 'password'> & { passwordHash: string }) {
        return prisma.user.create({
            data: {
                email: data.email,
                passwordHash: data.passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
            },
        });
    },
};