export interface CreateUserDTO {
    name: string;
    avatarUrl?: string | null;
    email: string;
    password: string;
}

export interface UpdateUserDTO {
    name: string;
    avatarUrl?: string | null;
    email: string;
}

export interface UpdateUserParams {
    id: string;
}

export interface DeleteUserParams {
    id: string;
}