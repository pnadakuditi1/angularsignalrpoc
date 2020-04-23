export interface User {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface Contact {
    id: string;
    username: string;
    name: string;
    selected: boolean;
}

export interface ApiResponse {
    message: string;
    result: any;
}
