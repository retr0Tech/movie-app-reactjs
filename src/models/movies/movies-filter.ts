import { MovieSortOptions } from "../../enums/movie-sort-options";

export class MoviesFilter {
    constructor(
        public id: string,
        public page: number,
        public sort_by: MovieSortOptions,
    ) {}
}