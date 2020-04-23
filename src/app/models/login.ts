export interface LoginRequest {
    username: string;
    password: string;
}

export interface Token {
    id: string;
    username: string;
    name: string;
}
