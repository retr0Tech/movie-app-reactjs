
import { MovieResponse } from "./movie-response";

export interface MoviesResponse {
    page: number;
    total_results: number;
    total_pages: number;
    results: MovieResponse[];
}