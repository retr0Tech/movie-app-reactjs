import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import moviesReducer from './movies/movies-slice';
import moviesFilterReducer from './movies/movies-filter-slice';

export const store = configureStore({
    reducer: {
        movies: moviesReducer,
        moviesFilter: moviesFilterReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;