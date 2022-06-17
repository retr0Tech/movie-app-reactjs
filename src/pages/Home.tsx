
import { SelectItem } from 'primereact/selectitem';
import { TabView, TabPanel } from 'primereact/tabview';import { useState, useEffect } from 'react';
import { MovieGrid } from '../components/Movies/MovieGrid';
import { MovieSortOptions } from '../enums/movie-sort-options';
import { Movie } from '../models/movies/movie';
import { MoviesFilter } from '../models/movies/movies-filter';
import { applyMoviesFilters, getMovies, getMoviesByPage } from '../services/movie-service';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectFavoriteMoviesFilter, selectMoviesFilter, setFavoriteMoviesFilter, setMoviesFilter } from '../store/movies/movies-filter-slice';
import { getMoviesAsync, selectFavoriteMovies, selectMovies } from '../store/movies/movies-slice';

export const Home = () => {
	const [activeIndex, setActiveIndex] = useState(0);
    const dispatch = useAppDispatch();
    const _getMovies = getMovies();
    const moviesFilter = useAppSelector(selectMoviesFilter);
    const movies = useAppSelector(selectMovies);
    const [totalMovies, setTotalMovies] = useState(0);
    const favoriteMoviesFilter = useAppSelector(selectFavoriteMoviesFilter);
    const favoriteMovies = useAppSelector(selectFavoriteMovies);
    const [filteredFavoriteMovies, setFilteredFavoriteMovies] = useState(favoriteMovies);
    const [totalFilteredFavoriteMovies, setTotalFilteredFavoriteMovies] = useState(0);
    const [isMoviesGridLoading, setIsMoviesGridLoading] = useState(false);

	useEffect(() =>{
		handleSetMovies(moviesFilter);
	}, [])
    useEffect(() => {
        const handleSetFavoriteMovies = (newFavoriteMoviesFilter: MoviesFilter) => {
            const newFilteredFavoriteMovies = applyMoviesFilters(favoriteMovies as Movie[], newFavoriteMoviesFilter);
            setFilteredFavoriteMovies(getMoviesByPage(newFilteredFavoriteMovies, newFavoriteMoviesFilter.page));
            setTotalFilteredFavoriteMovies(newFilteredFavoriteMovies.length);
        };

        handleSetFavoriteMovies(favoriteMoviesFilter);
    }, [favoriteMovies, favoriteMoviesFilter]);

    const handleChangeMoviesFilter = (newMoviesFilter: MoviesFilter) => {
        dispatch(setMoviesFilter(newMoviesFilter));
        handleSetMovies(newMoviesFilter);
    };

    const handleChangeFavoriteMoviesFilter = (newFavoriteMoviesFilter: MoviesFilter) => {
        dispatch(setFavoriteMoviesFilter(newFavoriteMoviesFilter));
    };

    const handleSetMovies = (newMoviesFilter: MoviesFilter) => {
        setIsMoviesGridLoading(true);
        dispatch(getMoviesAsync(newMoviesFilter, _getMovies)).then((totalMovies: number) => {
            setTotalMovies(totalMovies);
            setIsMoviesGridLoading(false);
        });
    };

    
    return ( 
		<div className = "Home">
			<TabView className="tabview-header-icon" activeIndex={ activeIndex } onTabChange={ (e) => setActiveIndex(e.index) }>
				<TabPanel header="Grid" leftIcon="pi pi-list">
					<MovieGrid movies={ movies }
                    totalRecords={ totalMovies }
                    moviesFilter={ moviesFilter }
                    isLoading={ isMoviesGridLoading }
                    onChangeFilter={ handleChangeMoviesFilter }></MovieGrid>
				</TabPanel>
				<TabPanel header="Favorites" leftIcon="pi pi-star">
					<MovieGrid movies={ filteredFavoriteMovies }
                    totalRecords={ totalFilteredFavoriteMovies }
                    moviesFilter={ favoriteMoviesFilter }
                    isLoading={ false }
                    onChangeFilter={ handleChangeFavoriteMoviesFilter }></MovieGrid>
				</TabPanel>
			</TabView>
		</div>
    );
}

export default Home;