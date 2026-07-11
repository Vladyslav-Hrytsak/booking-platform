export interface RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface JwtPayload {
    userId: string;
    role: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        role: string;
        plan: string;  
    };
}