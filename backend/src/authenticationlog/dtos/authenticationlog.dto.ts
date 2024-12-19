export class CreateAuthenticationLogDto {
    user_id: string;
    event: string;
    status: string;
}

export class UpdateAuthenticationLogDto {
    user_id?: string;
    event?: string;
    status?: string;
}