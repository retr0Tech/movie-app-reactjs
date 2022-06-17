export class MarkAsFavoriteBody {
    constructor(
        // tslint:disable-next-line: variable-name
        public media_id: number,
        public favorite: boolean,
        // tslint:disable-next-line: variable-name
        public media_type: string = 'movie'
    ) {}
}

export interface MarkAsFavoriteResponse {
    success: boolean;
    // tslint:disable-next-line: variable-name
    status_code: number;
    // tslint:disable-next-line: variable-name
    status_message: string;
}