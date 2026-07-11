import { prisma } from './prismaClient';

interface CreateListingDto {
    providerProfileId: string;
    subcategoryId: string;
    title: string;
    description: string;
    price: number;
}

interface ListingFilters {
    subcategoryId?: string;
    city?: string;
}

export const listingRepository = {
    // Получить все активные листинги с фильтрацией
    async findAll(filters: ListingFilters) {
        return prisma.listing.findMany({
            where: {
                isActive: true,
                // subcategoryId добавляется в where ТОЛЬКО если передан
                // если undefined — Prisma игнорирует это условие
                ...(filters.subcategoryId && { subcategoryId: filters.subcategoryId }),
                // city живёт не в Listing а в ProviderProfile — фильтруем через relation
                ...(filters.city && {
                    providerProfile: {
                        city: filters.city,
                    },
                }),
            },
            include: {
                providerProfile: {
                    select: {
                        id: true,
                        city: true,
                        ratingAvg: true,
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
                subcategory: true,
                images: {
                    orderBy: { order: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    },

    async findById(id: string) {
        return prisma.listing.findUnique({
            where: { id },
            include: {
                providerProfile: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
                subcategory: true,
                images: { orderBy: { order: 'asc' } },
                availabilitySlots: {
                    where: { isBooked: false },
                    orderBy: { startAt: 'asc' },
                },
            },
        });
    },

    // Посчитать листинги провайдера — для проверки лимита FREE плана
    async countByProvider(providerProfileId: string) {
        return prisma.listing.count({
            where: { providerProfileId },
        });
    },

    async create(data: CreateListingDto) {
        return prisma.listing.create({ data });
    },

    async update(
        id: string,
        data: Partial<Omit<CreateListingDto, 'providerProfileId'>>
    ) {
        return prisma.listing.update({ where: { id }, data });
    },

    async setActive(id: string, isActive: boolean) {
        return prisma.listing.update({
            where: { id },
            data: { isActive },
        });
    },
};