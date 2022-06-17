import { Rating } from "primereact/rating";
import { Button } from 'primereact/button';
import { Link } from "react-router-dom";
import { useEffect } from "react";
import  defaultImg from '../../assets/defaultImg.png';
import { Movie } from "../../models/movies/movie";
import FavoriteMovie from "../FavoriteMarker";

export const MovieGridItem = () => {
	
	return (movie: Movie) => {
		if (movie) {
		return (<div className="col-12 md:col-4">
			<div className="product-grid-item card">
			<div className='product-badge' style={{float: 'left'}}><FavoriteMovie movie={movie}></FavoriteMovie></div>

				<div className="product-grid-item-top">
					<div>
						<Link to={{ pathname: `/movie/${movie.id}` }} className="no-style">
										<h3
											className="p-card-title"
											style={{ cursor: 'pointer', outline: 'none' }}
										>
											{ movie.original_title }
										</h3>
						</Link>
					</div>
						
						{/* <span className="product-category">{data.category}</span> */}
				</div>
				<div className="product-grid-item-content">
					
					<img onError={ (e) => (e.target as any).src = defaultImg } src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : defaultImg} alt={movie.original_title} />
					
					<div className="product-description">{movie.overview}</div>
					<div className="product-grid-item-bottom">
						<span className="product-price">{movie.vote_average}/10</span>
					</div>
					<Rating value={(movie.vote_average as number)/2} readOnly cancel={false}></Rating>
				</div>
				<p style={{marginTop: '18px'}}>{movie.release_date}</p>
				
			</div>
		</div>)
		}
		return <></>
	};
}
export default MovieGridItem;