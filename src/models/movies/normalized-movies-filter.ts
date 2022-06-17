
export interface NormalizedMoviesFilter {
    id: string;
    page: number;
    sort_by: string;
    vote_average: number;
}

export interface NormalizedSchemaMoviesFilter {
    result: any;
    entities: {
        moviesFilter: NormalizedMoviesFilter,
    }
}