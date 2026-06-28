import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository';
import { RegisterDto, LoginDto, AuthResponse, JwtPayload } from '../types/auth';

function generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '15m',
    });
}

function generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
        expiresIn: '7d',
    });
}

export const authService = {
    async register(dto: RegisterDto): Promise<AuthResponse> {
        const existing = await userRepository.findByEmail(dto.email);
        if (existing) {
            throw new Error('Email already in use');
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);

        const user = await userRepository.create({
            email: dto.email,
            passwordHash,
            firstName: dto.firstName,
            lastName: dto.lastName,
        });

        const payload: JwtPayload = { userId: user.id, role: user.role };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return { accessToken, refreshToken, user };
    },

    async login(dto: LoginDto): Promise<AuthResponse> {

        const user = await userRepository.findByEmail(dto.email);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const payload: JwtPayload = { userId: user.id, role: user.role };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                role: user.role,
            },
        };
    },

    async refresh(refreshToken: string): Promise<{ accessToken: string }> {
        let payload: JwtPayload;
        try {
            payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
        } catch {
            throw new Error('Invalid refresh token');
        }

        const user = await userRepository.findById(payload.userId);
        if (!user) {
            throw new Error('User not found');
        }

        const newAccessToken = generateAccessToken({ userId: user.id, role: user.role });
        return { accessToken: newAccessToken };
    },
};