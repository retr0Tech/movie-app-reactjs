import { MovieSortOptions } from "../enums/movie-sort-options";
import { MarkAsFavoriteBody, MarkAsFavoriteResponse } from "../models/movies/favorite-marker-body";
import { Movie } from "../models/movies/movie";
import { MovieDetail } from "../models/movies/movie-detail";
import { MovieResponse } from "../models/movies/movie-response";
import { MoviesFilter } from "../models/movies/movies-filter";
import { MoviesResponse } from "../models/movies/movies-response";
import { get, post } from "./base-service";


const discoverPath = 'discover';
const moviePath = 'movie';
const accountPath = 'account';
const favoritePath = 'favorite';
const perPage = 12;
const sessionId: string = process.env.REACT_APP_API_SESSIONID|| '';
const accountId: string = process.env.REACT_APP_API_ACCOUNTID|| '';



export const getMovies = () => {
    const _get = get<MoviesResponse>();
    return async (moviesFilter: MoviesFilter) => {
        return await _get(
            `${discoverPath}/${moviePath}?page=${moviesFilter.page}&sort_by=${moviesFilter.sort_by}`
        );
    }
}

export const getMovie = () => {
    const _get = get<MovieDetail>();
    return async (movieId: number) => {
        return await _get(`${moviePath}/${movieId}`);
    }
}

export const getFavoriteMovies = () => {
    const _getFavoriteMoviesByPage = getFavoriteMoviesByPage();
    return async (accountId: number, sessionId: string) => {
        const favoriteMoviesFirstPage: MoviesResponse = (await _getFavoriteMoviesByPage(accountId, sessionId, 1)).data;
        const favoriteMovies: MovieResponse[] = [];
        favoriteMovies.push(...favoriteMoviesFirstPage.results);
        [...Array.from(Array(favoriteMoviesFirstPage.total_pages).keys())]
            .forEach(async (page: number) => {
                if (page > 1) {
                    favoriteMovies.push(
                        ...(await _getFavoriteMoviesByPage(accountId, sessionId, page)).data.results
                    );
                }
            });
        return favoriteMovies;
    }
}

export const getFavoriteMoviesByPage = () => {
    const _get = get<MoviesResponse>();
    return async (accountId: number, sessionId: string, page: number) => {
        return await _get(
            `${accountPath}/${accountId}/${favoritePath}/movies?session_id=${sessionId}&page=${page}`
        );
    }
}

export const markAsFavorite = () => {
    const _post = post<MarkAsFavoriteResponse, MarkAsFavoriteBody>();
    return async (
        markAsFavoriteBody: MarkAsFavoriteBody
    ) => {
        return await _post(
            `${accountPath}/${accountId}/${favoritePath}?session_id=${sessionId}`,
            markAsFavoriteBody
        );
    }
}
export const getMoviesByPage = (movies: Movie[], page: number): Movie[] => {
    const moviesClone = [...movies];
    const fromRecord: number = ((perPage * page) - perPage);
    const toRecord: number = (perPage * page);
    return moviesClone.slice(fromRecord, toRecord);
}
export const applyMoviesFilters = (movies: Movie[], moviesFilter: MoviesFilter): Movie[] => {
    let moviesClone = [...movies];
    moviesClone = sortMovies(moviesClone, moviesFilter.sort_by);
    return moviesClone;
}
export const sortByPopularityDescending = (movies: Movie[]): Movie[] => {
    return movies.sort((a, b) => b.popularity - a.popularity);
}

export const sortByPopularityAscending = (movies: Movie[]): Movie[] => {
    return movies.sort((a, b) => a.popularity - b.popularity);
}

export const sortByVoteAverageDescending = (movies: Movie[]): Movie[] => {
    return movies.sort((a, b) => b.vote_average - a.vote_average);
}

export const sortByVoteAverageAscending = (movies: Movie[]): Movie[] => {
    return movies.sort((a, b) => a.vote_average - b.vote_average);
}

export const sortByOriginalTitleDescending = (movies: Movie[]): Movie[] => {
    return movies.sort((a, b) => {
        const nameA = a.original_title.toUpperCase();
        const nameB = b.original_title.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
}

export const sortByOriginalTitleAscending = (movies: Movie[]): Movie[] => {
    return movies.sort((a, b) => {
        const nameA = a.original_title.toUpperCase();
        const nameB = b.original_title.toUpperCase();
        if (nameA > nameB) {
            return -1;
        }
        if (nameA < nameB) {
            return 1;
        }
        return 0;
    });
}

export const sortByReleaseDateDescending = (movies: Movie[]): Movie[] => {
    return movies.sort((a, b) => Number(b.release_date.replace(/-/g, '')) - Number(a.release_date.replace(/-/g, '')));
}

export const sortByReleaseDateAscending = (movies: Movie[]): Movie[] => {
    return movies.sort((a, b) => Number(a.release_date.replace(/-/g, '')) - Number(b.release_date.replace(/-/g, '')));
}
export const sortMovies = (movies: Movie[], sortBy: MovieSortOptions): Movie[] => {
    const moviesClone = [...movies];
    switch (sortBy) {
        case MovieSortOptions.VoteAverageDesc:
            return sortByVoteAverageDescending(moviesClone);
        case MovieSortOptions.VoteAverageAsc:
            return sortByVoteAverageAscending(moviesClone);
        case MovieSortOptions.OriginalTitleDesc:
            return sortByOriginalTitleDescending(moviesClone);
        case MovieSortOptions.OriginalTitleAsc:
            return sortByOriginalTitleAscending(moviesClone);
        case MovieSortOptions.ReleaseDateDesc:
            return sortByReleaseDateDescending(moviesClone);
        case MovieSortOptions.ReleaseDateAsc:
            return sortByReleaseDateAscending(moviesClone);
        default:
            return moviesClone;
    }
}
