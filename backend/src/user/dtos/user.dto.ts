export class CreateUserDto {
    name: string;
    email: string;
    password: string;
    dateOfBirth: Date;
    profile_picture_url: string;
    role: string;
}

export class updateUserDto {
    name?: string;
    email?: string;
    password?: string;
    dateOfBirth?: Date;
    profile_picture_url?: string;
}