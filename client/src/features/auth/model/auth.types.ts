export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        role: string;
        isEmailVerified: boolean;
        permissions?: string[];
    };
}

export interface RegistrationRequest {
    email: string;
}

export interface VerifyCodeRequest {
    email: string;
    code: string;
}

export interface CompleteRegistrationRequest {
    sessionToken: string;
    password: string;
}

export interface PasswordResetRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
}

export interface VerifyResetTokenRequest {
    token: string;
}