import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GenericResponse } from "../../models";
import { Movie } from "../../models/movies/movie";
import { MoviesFilter } from "../../models/movies/movies-filter";
import { MovieResponse } from "../../models/movies/movie-response";
import { MoviesResponse } from "../../models/movies/movies-response";
import { AppThunk, RootState } from "../index";

export interface MoviesState {
    movies: MovieResponse[];
    totalMovies: number;
    favoriteMovies: MovieResponse[];
};

const initialState: MoviesState = {
    movies: [],
    totalMovies: 0,
    favoriteMovies: JSON.parse(sessionStorage.getItem('favorite-movies') || '[]'),
};

export const getMoviesAsync = (
    moviesFilter: MoviesFilter,
    getMovies: (moviesFilter: MoviesFilter) => Promise<GenericResponse<MoviesResponse>>
): AppThunk<Promise<number>> => {
    return async (dispatch, getState) => {
        const moviesResponse = await getMovies(moviesFilter);
        dispatch(setMovies(moviesResponse.data.results));
        return Promise.resolve(moviesResponse.data.total_results);
    };
}

export const getFavoriteMoviesAsync = (
    getFavoriteMovies: (accountId: number, sessionId: string) => Promise<MovieResponse[]>
): AppThunk<Promise<void>> => {
    return async (dispatch: any, getState: any) => {
        const accountId = getState().login.accountResponse.id;
        const sessionId = getState().login.sessionId;
        const favoriteMovies = await getFavoriteMovies(accountId, sessionId);
        dispatch(setFavoriteMovies(favoriteMovies));
        return Promise.resolve();
    };
}

export const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        setMovies: (state, action: PayloadAction<MovieResponse[]>) => {
            const movies: Movie[] = action.payload.map((movieResponse) => {
                const movie = {
                    popularity: movieResponse.popularity,
                    vote_count: movieResponse.vote_count,
                    video: movieResponse.video,
                    poster_path: movieResponse.poster_path,
                    id: movieResponse.id,
                    adult: movieResponse.adult,
                    backdrop_path: movieResponse.backdrop_path,
                    original_language: movieResponse.original_language,
                    original_title: movieResponse.original_title,
                    genre_ids: movieResponse.genre_ids,
                    title: movieResponse.title,
                    vote_average: movieResponse.vote_average,
                    overview: movieResponse.overview,
                    release_date: movieResponse.release_date,
                    isFavorite: state.favoriteMovies.map(x => x.id).includes(movieResponse.id)
                };
                return movie;
            });
            state.movies = movies;
            state.totalMovies = movies.length;
        },
        setFavoriteMovies: (state, action: PayloadAction<MovieResponse[]>) => {
            const favoriteMovies = action.payload.map((movieResponse) => {
                const movie = {
                    popularity: movieResponse.popularity,
                    vote_count: movieResponse.vote_count,
                    video: movieResponse.video,
                    poster_path: movieResponse.poster_path,
                    id: movieResponse.id,
                    adult: movieResponse.adult,
                    backdrop_path: movieResponse.backdrop_path,
                    original_language: movieResponse.original_language,
                    original_title: movieResponse.original_title,
                    genre_ids: movieResponse.genre_ids,
                    title: movieResponse.title,
                    vote_average: movieResponse.vote_average,
                    overview: movieResponse.overview,
                    release_date: movieResponse.release_date,
                    isFavorite: true
                };
                return movie;
            });
            sessionStorage.setItem('favorite-movies', JSON.stringify(favoriteMovies));
            state.favoriteMovies = favoriteMovies;
        },
        setFavoriteMovie: (state, action: PayloadAction<Movie>) => {
            const favoriteMovieClone = { ...action.payload };
            const moviesClone: MovieResponse[] = [ ...state.movies ];
            const indexInMovies: number = moviesClone.map(x => x.id).indexOf(favoriteMovieClone.id);
            if (indexInMovies > -1) {
                moviesClone.splice(indexInMovies, 1);
                moviesClone.splice(indexInMovies, 0, favoriteMovieClone);
            }
            const favoriteMoviesClone: MovieResponse[] = [ ...state.favoriteMovies ];
            if (favoriteMovieClone.isFavorite) {
                favoriteMoviesClone.push(favoriteMovieClone);
            } else {
                const indexInFavoriteMovies: number = favoriteMoviesClone.map(x => x.id).indexOf(favoriteMovieClone.id);
                if (indexInFavoriteMovies > -1) {
                    favoriteMoviesClone.splice(indexInFavoriteMovies, 1);
                }
            }
            sessionStorage.setItem('favorite-movies', JSON.stringify(favoriteMoviesClone));
            state.favoriteMovies = favoriteMoviesClone;
            state.movies = moviesClone;
        }
    }
});

export const {
    setMovies,
    setFavoriteMovies,
    setFavoriteMovie,
} = moviesSlice.actions;

export const selectMovies = (state: RootState) => state.movies.movies;
export const selectFavoriteMovies = (state: RootState) => state.movies.favoriteMovies;
export const selectTotalMovies = (state: RootState) => state.movies.totalMovies;

export default moviesSlice.reducer;