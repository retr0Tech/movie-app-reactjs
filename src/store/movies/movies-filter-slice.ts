import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { normalize, schema, denormalize } from "normalizr";
import { MovieSortOptions } from "../../enums/movie-sort-options";
import { MoviesFilter } from "../../models/movies/movies-filter";
import { NormalizedMoviesFilter, NormalizedSchemaMoviesFilter } from "../../models/movies/normalized-movies-filter";
import { RootState } from "../index";

export interface MoviesFilterState {
    moviesFilterResult: any;
    moviesFilter: NormalizedMoviesFilter;
    favoriteMoviesFilterResult: any;
    favoriteMoviesFilter: NormalizedMoviesFilter;
};

const getMoviesFilterSchema = () => {
    const moviesFilter = new schema.Entity('moviesFilter', {});
    return moviesFilter;
}
export const defaultMoviesFilter: MoviesFilter = new MoviesFilter('1', 1, MovieSortOptions.VoteAverageDesc);
const defaultNormalizedMoviesFilter = normalize(defaultMoviesFilter, getMoviesFilterSchema()) as NormalizedSchemaMoviesFilter;

const initialState: MoviesFilterState = {
    moviesFilterResult: defaultNormalizedMoviesFilter.result,
    moviesFilter: defaultNormalizedMoviesFilter.entities.moviesFilter,
    favoriteMoviesFilterResult: defaultNormalizedMoviesFilter.result,
    favoriteMoviesFilter: defaultNormalizedMoviesFilter.entities.moviesFilter,
};

export const moviesFilterSlice = createSlice({
    name: 'moviesFilter',
    initialState,
    reducers: {
        setMoviesFilter: (state, action: PayloadAction<MoviesFilter>) => {
            const moviesFilterClone = { ...action.payload };
            const normalizedMoviesFilter = normalize(moviesFilterClone, getMoviesFilterSchema()) as NormalizedSchemaMoviesFilter;
            state.moviesFilterResult = normalizedMoviesFilter.result;
            state.moviesFilter = normalizedMoviesFilter.entities.moviesFilter;
        },
        setFavoriteMoviesFilter: (state, action: PayloadAction<MoviesFilter>) => {
            const moviesFilterClone = { ...action.payload };
            const normalizedMoviesFilter = normalize(moviesFilterClone, getMoviesFilterSchema()) as NormalizedSchemaMoviesFilter;
            state.favoriteMoviesFilterResult = normalizedMoviesFilter.result;
            state.favoriteMoviesFilter = normalizedMoviesFilter.entities.moviesFilter;
        }
    }
});

export const {
    setMoviesFilter,
    setFavoriteMoviesFilter
} = moviesFilterSlice.actions;

export const selectMoviesFilter = (state: RootState) => {
    const entities = {
        moviesFilter: state.moviesFilter.moviesFilter,
    };
    return denormalize(state.moviesFilter.moviesFilterResult, getMoviesFilterSchema(), entities) as MoviesFilter;
};
export const selectFavoriteMoviesFilter = (state: RootState) => {
    const entities = {
        moviesFilter: state.moviesFilter.favoriteMoviesFilter,
    };
    return denormalize(state.moviesFilter.favoriteMoviesFilterResult, getMoviesFilterSchema(), entities) as MoviesFilter;
};

export default moviesFilterSlice.reducer;