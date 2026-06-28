import { PrismaClient } from '../../generated/prisma';

// В dev режиме ts-node-dev перезапускает модули при изменениях.
// Без этого трюка каждый перезапуск создаёт новое соединение с БД.
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ?? new PrismaClient({ log: ['query', 'error'] });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}