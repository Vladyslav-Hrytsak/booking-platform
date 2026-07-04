import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding...');

    // upsert — создаёт если нет, обновляет если есть
    // Безопасно запускать несколько раз — не создаст дубли
    const plumbing = await prisma.category.upsert({
        where: { name: 'Сантехніка' },
        update: {},
        create: { name: 'Сантехніка' },
    });

    const beauty = await prisma.category.upsert({
        where: { name: 'Краса' },
        update: {},
        create: { name: 'Краса' },
    });

    const repair = await prisma.category.upsert({
        where: { name: 'Ремонт' },
        update: {},
        create: { name: 'Ремонт' },
    });

    // Подкатегории для Сантехніка
    await prisma.subcategory.upsert({
        where: { categoryId_name: { categoryId: plumbing.id, name: 'Заміна труб' } },
        update: {},
        create: { categoryId: plumbing.id, name: 'Заміна труб' },
    });

    await prisma.subcategory.upsert({
        where: { categoryId_name: { categoryId: plumbing.id, name: 'Усунення засорів' } },
        update: {},
        create: { categoryId: plumbing.id, name: 'Усунення засорів' },
    });

    await prisma.subcategory.upsert({
        where: { categoryId_name: { categoryId: plumbing.id, name: 'Встановлення сантехніки' } },
        update: {},
        create: { categoryId: plumbing.id, name: 'Встановлення сантехніки' },
    });

    // Подкатегории для Краса
    await prisma.subcategory.upsert({
        where: { categoryId_name: { categoryId: beauty.id, name: 'Манікюр' } },
        update: {},
        create: { categoryId: beauty.id, name: 'Манікюр' },
    });

    await prisma.subcategory.upsert({
        where: { categoryId_name: { categoryId: beauty.id, name: 'Стрижка' } },
        update: {},
        create: { categoryId: beauty.id, name: 'Стрижка' },
    });

    // Подкатегории для Ремонт
    await prisma.subcategory.upsert({
        where: { categoryId_name: { categoryId: repair.id, name: 'Електрика' } },
        update: {},
        create: { categoryId: repair.id, name: 'Електрика' },
    });

    await prisma.subcategory.upsert({
        where: { categoryId_name: { categoryId: repair.id, name: 'Малярні роботи' } },
        update: {},
        create: { categoryId: repair.id, name: 'Малярні роботи' },
    });

    console.log('Done ✅');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());