import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { useEffect } from 'react';
import { Dropdown, DropdownChangeParams } from "primereact/dropdown";
import { MultiSelectChangeParams } from "primereact/multiselect";
import { RatingChangeParams } from "primereact/rating";
import { useState } from "react";
import MovieListItem from './MovieListItem';
import MovieGridItem from './MovieGridItem';
import { MovieResponse } from '../../models/movies/movie-response';
import { MoviesFilter } from '../../models/movies/movies-filter';
import { SelectItem } from 'primereact/selectitem';
import { MovieSortOptions } from '../../enums/movie-sort-options';

export const MovieGrid = ({
    movies,
    totalRecords,
    moviesFilter,
    isLoading,
    onChangeFilter
}: {
    movies: MovieResponse[],
    totalRecords: number,
    moviesFilter: MoviesFilter,
    isLoading: boolean,
    onChangeFilter: (moviesFilter: MoviesFilter) => void
}) => {
    const [layout, setLayout] = useState('grid');
	const [sortOption, setSortOption] = useState(moviesFilter.sort_by);
	const [first, setFirst] = useState(0);
	const perPage = 12;

	const sortOptions: SelectItem[] = [
        {label: 'Rating Asc', value: MovieSortOptions.VoteAverageAsc},
        {label: 'Rating Desc', value: MovieSortOptions.VoteAverageDesc},
        {label: 'Name Asc', value: MovieSortOptions.OriginalTitleDesc},
        {label: 'Name Desc', value: MovieSortOptions.OriginalTitleAsc},
        {label: 'Year Asc', value: MovieSortOptions.ReleaseDateDesc},
    ];
	const onSortChange = (event: DropdownChangeParams) => {
        const selectedSortOption = event.value;
        setSortOption(selectedSortOption);
        const moviesFilterClone = { ...moviesFilter };
        moviesFilterClone.sort_by = selectedSortOption;
        onChangeFilter(moviesFilterClone);
    }
	const renderHeader = () => {
        return (
            <div className="grid grid-nogutter">
				<div className="col-1" style={{alignSelf: 'center'}}>
					<p>Sort By</p>
				</div>
                <div className="col-5" style={{textAlign: 'left'}}>
                    <Dropdown value={ sortOption } options={ sortOptions } optionLabel="label" placeholder="Sort By" onChange={onSortChange}/>
                </div>
                <div className="col-6" style={{textAlign: 'right'}}>
                    <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
                </div>
            </div>
        );
    }
	const onChangePage = (event: any) => {
        const startIndex = event.first;
        setFirst(startIndex);
        const page: number = (startIndex / perPage) + 1;
        const moviesFilterClone = { ...moviesFilter };
        moviesFilterClone.page = page;
        onChangeFilter(moviesFilterClone);
    };
	const itemTemplate = layout === 'list' ? MovieListItem() : MovieGridItem();
    const header = renderHeader();
	return (
			<div className="dataview-demo">
				<div className="card">
					<DataView 
						value={movies} 
						layout={layout} 
						header={header}
						itemTemplate={itemTemplate}
						lazy
						paginator 
						rows={perPage}
						totalRecords={ totalRecords }
						onPage={ onChangePage }
						loading={ isLoading } />
				</div>
			</div>
	)
}
export default MovieGrid;

function useMountEffect(arg0: () => void) {
	throw new Error('Function not implemented.');
}
