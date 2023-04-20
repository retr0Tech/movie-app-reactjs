
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
/*New imports */
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Image } from 'primereact/image';



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
            <div className="card">
                <Card title="Centennial Movies">
                </Card>
            </div>
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
                /*New Tab */
                <TabPanel header="About" leftIcon="pi pi-star">
                    <Panel header="Developers">
                        <TabView>
                            <TabPanel header="Ruiz Melo, Elliot">
                                <p className="m-0">
                                    Student ID:
                                </p>
                                <Image src="https://media.licdn.com/dms/image/D5603AQHF6jqvdXvU8A/profile-displayphoto-shrink_800_800/0/1673641008078?e=2147483647&v=beta&t=1X1D1wjgOlkrtarTCdCJzmv7KTfk-maTIlPA-wn9PWQ" alt="Image" width="250" />
                                
                            </TabPanel>
                            <TabPanel header="Molina Acosta, Carlos">
                                <p className="m-0">
                                Student ID: 301232974
                                </p>
                                <Image src="https://media.licdn.com/dms/image/D5603AQEMW2L8UZwbNA/profile-displayphoto-shrink_400_400/0/1681969864725?e=1687392000&v=beta&t=gNyvVMhNe22n7-kd5Nruas0Dl9IrhpaLQr2ET4fnfic" alt="Image" width="250" />
                            </TabPanel>
                        </TabView>
                    </Panel>
         
				</TabPanel>
			</TabView>
                <Card title="© Centennial College 2023">
                </Card>
		</div>
    );
}

export default Home;