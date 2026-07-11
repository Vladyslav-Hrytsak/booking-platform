import { listingRepository } from '../repositories/listingRepository';
import { providerRepository } from '../repositories/providerRepository';
import { userRepository } from '../repositories/userRepository';

const FREE_PLAN_LISTING_LIMIT = 3;

interface CreateListingDto {
    providerProfileId: string;
    subcategoryId: string;
    title: string;
    description: string;
    price: number;
}

interface UpdateListingDto {
    title?: string;
    description?: string;
    price?: number;
    subcategoryId?: string;
}

interface ListingFilters {
    subcategoryId?: string;
    city?: string;
}

export const listingService = {
    async getAll(filters: ListingFilters) {
        return listingRepository.findAll(filters);
    },

    async getById(id: string) {
        const listing = await listingRepository.findById(id);
        if (!listing) {
            throw new Error('Listing not found');
        }
        return listing;
    },

    async create(requestUserId: string, dto: CreateListingDto) {
        // 1. Проверяем что providerProfile принадлежит текущему юзеру
        const profile = await providerRepository.findById(dto.providerProfileId);
        if (!profile) {
            throw new Error('Provider profile not found');
        }
        if (profile.userId !== requestUserId) {
            throw new Error('Forbidden');
        }

        // 2. Проверяем что профиль одобрен модератором
        if (profile.status !== 'APPROVED') {
            throw new Error('Provider profile is not approved');
        }

        // 3. Проверяем лимит FREE плана
        const user = await userRepository.findById(requestUserId);
        if (user?.plan === 'FREE') {
            const count = await listingRepository.countByProvider(dto.providerProfileId);
            if (count >= FREE_PLAN_LISTING_LIMIT) {
                throw new Error('Free plan listing limit reached');
            }
        }

        return listingRepository.create(dto);
    },

    async update(id: string, requestUserId: string, dto: UpdateListingDto) {
        const listing = await listingRepository.findById(id);
        if (!listing) {
            throw new Error('Listing not found');
        }

        // Проверяем владение через providerProfile
        if (listing.providerProfile.userId !== requestUserId) {
            throw new Error('Forbidden');
        }

        return listingRepository.update(id, dto);
    },

    async setActive(id: string, requestUserId: string, isActive: boolean) {
        const listing = await listingRepository.findById(id);
        if (!listing) {
            throw new Error('Listing not found');
        }

        if (listing.providerProfile.userId !== requestUserId) {
            throw new Error('Forbidden');
        }

        return listingRepository.setActive(id, isActive);
    },
};